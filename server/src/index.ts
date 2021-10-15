import express, { NextFunction } from "express";
import *  as bodyParser from "body-parser";
import { configProduction, configTesting, Config } from "./config";
import { AuthenticationHandler, AuthInfo } from "../../ms-api";
import RealmsClient, { SlotNumber, Template, Templates, TemplateType } from "../../realms-api";
import { AuthTokenInDB, DB } from "./db";
import * as https from "https";
import hat from "hat";
import cors from "cors";

export let config: Config;
if (process.argv[2] == "--local") {
	config = configTesting;
} else {
	config = configProduction;
}

const db = new DB();
const tokenTimestamps: Map<string, number> = new Map<string, number>();
const tokens: Map<string, AuthInfo> = new Map<string, AuthInfo>();
const clients: Map<string, RealmsClient> = new Map<string, RealmsClient>();
let latestVersion: string;

const app = express();
app.use(bodyParser.json());
// app.use((req, res, next)=>{
// 	let origin: string = (req.headers.origin == "http://localhost:8080") ? "http://localhost:8080" : "https://realmshub.com";
// 	res.set("Access-Control-Allow-Origin", origin);
// 	res.set("Access-Control-Allow-Methods","GET, POST");
// 	res.set("Access-Control-Allow-Headers","X-Requested-With,Content-Type");
// 	return next();
// })
// const corsOptions = {
// 	origin: "*",
// 	methods: "GET,POST",
// 	preflightContinue: false
// }
app.use(cors());

const authHandler = new AuthenticationHandler(config.clientId, config.clientSecret, config.redirectUri);

async function checkAndInitAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
	let id = req.body?.id as string;
	if (!id || typeof id != "string") {
		res.sendStatus(401);
		return;
	}
	if (!tokenTimestamps.has(id)) {
		let dbToken = await db.getToken(id);
		if (!dbToken) {
			res.sendStatus(401);
			return;
		} else {
			initAuth(id, dbToken);
		}
	}
	tokenTimestamps.set(id, Date.now());
	return next();
}

function initAuth(_id: string, _token: AuthInfo) {
	tokenTimestamps.set(_id, Date.now());
	tokens.set(_id, _token);
	clients.set(_id, new RealmsClient(latestVersion, _token.mc_token.access_token, _token.mc_info.id, _token.mc_info.name));
	let tokenInDB: AuthTokenInDB = { ..._token, id: _id };
	db.saveToken(tokenInDB);
}

function logoutEverywhere(_id: string) {
	tokens.delete(_id);
	tokenTimestamps.delete(_id);
	clients.delete(_id);
	db.removeToken(_id);
}

//#region login/out
app.route("/login")
	.get((req, res) => {
		res.send(authHandler.forwardUrl);
	})
	.post(async (req, res, next) => {
		let code: string = req.body.code;
		if (!code || typeof code != "string") {
			res.sendStatus(400);
			return;
		}
		try {
			let authInfo: AuthInfo = await authHandler.getAuthCodes(code);
			let id: string = hat(512, 32) + "." + hat(512, 32);
			initAuth(id, authInfo);
			res.send({ id: id, username: authInfo.mc_info.name });
		} catch (error) {
			anErrorOccured(<Error>error, res);
		}
	})
	.all(wrongMethod);


app.route("/logout")
	.post((req, res) => {
		let id: string = req.body.id;
		if (!id || typeof id != "string") {
			res.sendStatus(400);
			return;
		}
		logoutEverywhere(id);
		res.sendStatus(200);
	})
	.all(wrongMethod);
app.route("/check-login")
	.post(checkAndInitAuth, (req, res) => {
		res.sendStatus(200);
	})
	.all(wrongMethod);
//#endregion

app.route("/templates/:type/:page/:size")
	.get(async (req, res) => {
		let type: TemplateType = <TemplateType>req.params.type;
		let page: number = parseInt(req.params.page);
		let size: number = parseInt(req.params.size);
		res.send(await getTemplates(type, page, size, req.body.id))
	})
	.all(wrongMethod);

app.route("/invites/:command")
	.post(checkAndInitAuth, async (req, res) => {
		let client: RealmsClient = <RealmsClient>clients.get(req.body.id);
		let command: string = req.params.command;

		if (command == "get") {
			res.send(await client.invites());
		} else if (command == "count") {
			res.send(await client.inviteCount());
		} else {
			let invID = req.body.invitationId;
			if (!invID) {
				res.send(400);
				return;
			}
			if (command == "accept") {
				res.send(await client.acceptInvite(invID));
			} else if (command == "reject") {
				res.send(await client.rejectInvite(invID));
			}
		}
	})
	.all(wrongMethod);

app.route("/worlds/slot/:command")
	.post(checkAndInitAuth, async (req, res) => {
		let worldId: number = parseInt(req.body.worldId);
		let slot: SlotNumber = <SlotNumber>parseInt(req.body.slot);
		if (isNaN(worldId) || worldId < 0 || slot < 1 || slot > 3) {
			res.sendStatus(400);
			return;
		}

		let client: RealmsClient = <RealmsClient>clients.get(req.body.id);
		let command: string = req.params.command;

		switch (command) {
			case "settings":
				let settings = req.body.settings;
				if (!settings) {
					res.sendStatus(400);
					return;
				}
				res.send(await client.setSlotSettings(worldId, slot, settings));
				break;
			case "set":
				res.send(await client.setToSlot(worldId, slot));
				break;
			default:
				res.sendStatus(404);
				break;
		}
	})
	.all(wrongMethod);

app.route("/worlds/player/:command")
	.post(checkAndInitAuth, async (req, res) => {
		let worldId: number = parseInt(req.body.worldId);
		let uuid: string = req.body.uuid;
		if (isNaN(worldId) || worldId < 0 || !uuid || uuid === "" || typeof uuid != "string") {
			res.sendStatus(400);
			return;
		}
		let client: RealmsClient = <RealmsClient>clients.get(req.body.id);
		let command: string = req.params.command;

		switch (command) {
			case "deop":
				res.send(await client.deopPlayer(worldId, uuid));
				break;
			case "op":
				res.send(await client.makeOP(worldId, uuid));
				break;
			case "invite":
				res.send(await client.invitePlayer(worldId, req.body.name, uuid));
				break;
			case "kick":
				res.send(await client.kickPlayer(worldId, uuid));
				break;
			default:
				res.sendStatus(404);
				break;
		}
	})
	.all(wrongMethod);

app.route("/worlds/:command")
	.post(checkAndInitAuth, async (req, res) => {
		let worldId: number = parseInt(req.body.worldId);
		if (!worldId || isNaN(worldId)) {
			res.sendStatus(400);
			return;
		}
		let client: RealmsClient = <RealmsClient>clients.get(req.body.id);
		let command = req.params.command;
		switch (command) {
			case "get-one":
				res.send(await client.world(worldId));
				break;
			case "backups":
				res.send(await client.backups(worldId));
				break;
			case "close":
				res.send(await client.closeRealm(worldId));
				break;
			case "livestats":
				res.send(await client.getLiveStats(worldId));
				break;
			case "ops":
				res.send(await client.getOps(worldId));
				break;
			case "ip":
				res.send(await client.ip(worldId));
				break;
			case "leave":
				res.send(await client.leaveServer(worldId));
				break;
			case "open":
				res.send(await client.openRealm(worldId));
				break;
			case "reset":
				let seed = req.body.seed;
				let worldType = req.body.worldType;
				let genStructures = !!req.body.generateStructures;
				if (seed == undefined || worldType == undefined) {
					res.sendStatus(400);
					break;
				}
				res.send(await client.resetWorldToSeed(worldId, seed, worldType, genStructures));
				break;
			case "reset-template":
				let template: number = parseInt(req.body.template);
				if (isNaN(template) || template < 0) {
					res.sendStatus(400);
					break;
				}
				res.send(await client.resetWorldToTemplate(worldId, template));
				break;
			case "minigame":
				let minigame: number = parseInt(req.body.minigame);
				if (isNaN(minigame) || minigame < 0) {
					res.sendStatus(400);
					break;
				}
				res.send(await client.setToMinigame(worldId, minigame));
				break;
			case "slot":
				let slot: SlotNumber = <SlotNumber>parseInt(req.body.slot);
				if (isNaN(slot) || slot < 1 || slot > 3) {
					res.sendStatus(400);
					break;
				}
				res.send(await client.setToSlot(worldId, slot));
				break;
			case "settings":
				let settings = req.body.settings;
				if (!settings.name || !settings.description) {
					res.sendStatus(400);
					break;
				}
				res.send(await client.setWorldSettings(worldId, settings));
				break;
			case "subscriptions":
				res.send(await client.subscriptions(worldId));
				break;

			case "uploadinfo":
				res.send(await client.uploadInfo(worldId));
				break;
			default:
				res.sendStatus(404);
				break;
		}
	})
	.all(wrongMethod);

app.route("/:command")
	.post(checkAndInitAuth, async (req, res) => {
		let command: string = req.params.command;
		let client: RealmsClient = <RealmsClient>clients.get(req.body.id);
		switch (command) {
			case "worlds":
				res.send(await client.worlds());
				break;
			case "tos":
				res.send(await client.agreeToTos());
				break;
			case "compatible":
				res.send(await client.compatible());
				break;
			case "news":
				res.send(await client.getNews());
				break;
			case "mco":
				res.send(await client.mcoAvailable());
				break;
			case "regionping":
				res.send(await client.regionPingResult());
				break;
			case "stage":
				res.send(await client.stageAvailable());
				break;
			case "trial":
				res.send(await client.trialAvailable());
				break;
			default:
				res.sendStatus(404);
				break;
		}
	})
	.all(wrongMethod);

// Catch-all
app.all("*", (req, res) => {
	res.sendStatus(404);
});

start();
async function start() {
	await getLatestVersion();
	await db.connect();
	app.listen(9001);
	console.log("Listening on Port 9001 and ready to go!");
}

async function getLatestVersion() {
	return new Promise((resolve, reject) => {
		https.get("https://launchermeta.mojang.com/mc/game/version_manifest.json", (res) => {
			let data = "";
			res.on("data", d => {
				data += d;
			});
			res.on("end", () => {
				let parsed = JSON.parse(data);
				let version = parsed?.latest?.release;
				latestVersion = version || latestVersion;
				resolve(latestVersion);
			});
		})

	});
}

function wrongMethod(req: express.Request, res: express.Response) {
	res.sendStatus(405);
}

function anErrorOccured(error: Error, res: express.Response) {
	res.send({
		error: {
			code: 500,
			message: error.message
		}
	})
}

const templateMap: Map<TemplateType, Template[]> = new Map<TemplateType, Template[]>();
async function getTemplates(type: TemplateType, page: number, size: number, clientId?: string): Promise<Templates> {
	let templates = templateMap.get(type);
	if (templates) {
		let result: Templates = {
			page,
			size,
			total: templates.length,
			templates: templates.slice((page + 1) * size, (page + 2) * size)
		}
		return result;
	}
	if (!clientId || !clients.has(clientId)) {
		return { page: -1, size: -1, total: -1, templates: [] };
	}

	let client: RealmsClient = <RealmsClient>clients.get(clientId);
	let types: TemplateType[] = ["MINIGAME", "ADVENTUREMAP", "EXERIENCE", "NORMAL", "INSPIRATION"];
	for (let type of types) {
		let oneTemp = await client.templates(type, 0, 1);
		let allTemps = await client.templates(type, 0, oneTemp.total);
		templateMap.set(type, allTemps.templates);
	}

	return getTemplates(type, page, size);
}