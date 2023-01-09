import express, { NextFunction } from "express";
import { clients } from ".";
import { SlotNumber, Template, Templates, TemplateType, RealmsClientJava } from "../../realms-api";
import { checkAndInitAuth, wrongMethod } from "./shared";

export function registerBedrockPaths(app: express.Express) {
	let prefix: string = "/br";

	app.route(prefix + "/invites/:command")
		.post(checkAndInitAuth, async (req, res) => {
			let client: RealmsClientJava = <RealmsClientJava>clients.get(req.body.id);
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

	app.route(prefix + "/worlds/slot/:command")
		.post(checkAndInitAuth, async (req, res) => {
			let worldId: number = parseInt(req.body.worldId);
			let slot: SlotNumber = <SlotNumber>parseInt(req.body.slot);
			if (isNaN(worldId) || worldId < 0 || slot < 1 || slot > 3) {
				res.sendStatus(400);
				return;
			}

			let client: RealmsClientJava = <RealmsClientJava>clients.get(req.body.id);
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

	app.route(prefix + "/worlds/player/:command")
		.post(checkAndInitAuth, async (req, res) => {
			let worldId: number = parseInt(req.body.worldId);
			let uuid: string = req.body.uuid;
			if (isNaN(worldId) || worldId < 0 || !uuid || uuid === "" || typeof uuid != "string") {
				res.sendStatus(400);
				return;
			}
			let client: RealmsClientJava = <RealmsClientJava>clients.get(req.body.id);
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

	app.route(prefix + "/worlds/:command")
		.post(checkAndInitAuth, async (req, res) => {
			let worldId: number = parseInt(req.body.worldId);
			if (!worldId || isNaN(worldId)) {
				res.sendStatus(400);
				return;
			}
			let client: RealmsClientJava = <RealmsClientJava>clients.get(req.body.id);
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

	app.route(prefix + "/:command")
		.post(checkAndInitAuth, async (req, res) => {
			let command: string = req.params.command;
			let client: RealmsClientJava = <RealmsClientJava>clients.get(req.body.id);
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
}

const templateMap: Map<TemplateType, Template[]> = new Map<TemplateType, Template[]>();
let lastTemplateCheck: number = 0;
async function getTemplates(type: TemplateType, page: number, size: number, clientId?: string): Promise<Templates> {
	let templates = templateMap.get(type);
	let hoursSinceLastCheck: number = (Date.now() - lastTemplateCheck) / 1000 / 60 / 60;
	if (!(clientId && clients.has(clientId) && hoursSinceLastCheck > 24)){	//if there is no client ID and the last check was less than 24 hours ago check if templates exist, otherwise reload templates
		if (templates) {
			let result: Templates = {
				page,
				size,
				total: templates.length,
				templates: templates.slice((page) * size, (page + 1) * size)
			}
			return result;
		}
	}
	
	let types: TemplateType[] = ["MINIGAME", "ADVENTUREMAP", "EXPERIENCE", "NORMAL", "INSPIRATION"];
	if (!clientId || !clients.has(clientId) || !types.includes(type)) {
		return { page: -1, size: -1, total: -1, templates: [] };
	}

	let client: RealmsClientJava = <RealmsClientJava>clients.get(clientId);
	for (let type of types) {
		let oneTemp = await client.templates(type, 0, 1);
		let allTemps = await client.templates(type, 0, oneTemp.total);
		templateMap.set(type, allTemps.templates);
	}
	lastTemplateCheck = Date.now();

	return getTemplates(type, page, size);
}