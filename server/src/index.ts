import express from "express";
import *  as bodyParser from "body-parser";
import { configProduction, configTesting, Config } from "./config";
import { AuthenticationHandler, AuthInfo } from "../../ms-api";
import {RealmsClientJava} from "../../realms-api";
import { DB } from "./db";
import * as https from "https";
import hat from "hat";
import cors from "cors";
import { readFile } from "fs/promises";
import { anErrorOccured, checkAndInitAuth, initAuth, wrongMethod } from "./shared";
import { registerJavaPaths } from "./java";

export let config: Config;
if (process.argv[2] == "--local") {
	config = configTesting;
} else {
	config = configProduction;
}

export const db = new DB();
export const tokenTimestamps: Map<string, number> = new Map<string, number>();
export const tokens: Map<string, AuthInfo> = new Map<string, AuthInfo>();
export const clients: Map<string, RealmsClientJava> = new Map<string, RealmsClientJava>();
export let latestVersion: string;

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
app.use(cors({ methods: ["GET", "POST", "SEARCH"] }));

export const authHandler = new AuthenticationHandler(config.clientId, config.clientSecret, config.redirectUri);

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

app.route("/announcement")
.get(async (req, res) => {
	res.send(await getAnnouncement());
})
.all(wrongMethod);

registerJavaPaths(app);

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

async function getAnnouncement(): Promise<string> {
	return await readFile(__dirname + "/../../announcement.html", "utf-8");
}
