import express from "express";
import { AuthenticationHandler } from "../../ms-api";
import JavaRealmsApiClient from "../../realms-api";

const app = express();

const clientId = "cf8b68fc-eb1a-442f-ae01-5fa94adce065";
const clientSecret = "Kn7e34~A0-_Yu__u8KTn295OtC5vZW30-E";
const redirectUri = "http://localhost:3000/login-redirect";

const ah = new AuthenticationHandler(clientId, clientSecret, redirectUri);

app.get("/", (req, res) => {
	res.redirect(ah.forwardUrl);
});

app.get("/login-redirect", async (req, res) => {
	let code: string = req.query.code as string;
	if (!code) {
		res.send("Error, code could not be retrieved.");
		return;
	}
	let result = await ah.getAuthCodes(code);
	res.json(result);

	const worldId = 4156375;
	// "https://launchermeta.mojang.com/mc/game/version_manifest.json"
	const token = result.mc_token.access_token;
	const uuid = result.mc_info.id;
	const name = result.mc_info.name;
	const realmsClient: JavaRealmsApiClient = new JavaRealmsApiClient("1.17.1", token, uuid, name);

	//#region  GET
	console.log("compatible", await realmsClient.compatible());
	// let worlds = await realmsClient.worlds();
	// res.json(worlds);
	// let world = await realmsClient.world(worldId);
	// console.log("world", world);
	// let ip = await realmsClient.ip(worldId);
	// console.log("ip", ip);
	// let backups = await realmsClient.backups(worldId);
	// console.log("backups", backups);
	// let downloadLatestBackup = await realmsClient.downloadLatestBackup(worldId, 1);
	// console.log("downloadLatestBackup", downloadLatestBackup);
	// let getOps = await realmsClient.getOps(worldId);
	// console.log("ops", getOps);
	// let subscriptions = await realmsClient.subscriptions(worldId);
	// console.log("subs", subscriptions);
	// let templates = await realmsClient.templates("ADVENTUREMAP", 0, 1);
	// console.log("template", templates);


	let invCount = await realmsClient.inviteCount();
	// console.log("inv count", invCount);
	let invs = await realmsClient.invites();
	// console.log("invs", invs);
	//#endregion

	//#region  PUT
	if (invCount > 0) {
		let accepted = await realmsClient.acceptInvite(invs.invites[0].invitationId);
		console.log("accepted", accepted);
		// let rejected = await realmsClient.rejectInvite(invs.invites[0].invitationId);
		// console.log("rejected", rejected);
	}

	// let close = await realmsClient.closeRealm(worldId);
	// console.log("close", close);
	// let open = await realmsClient.openRealm(worldId);
	// console.log("open", open);

	// let setMinigame = await realmsClient.setToMinigame(worldId, 387);
	// console.log("setminigame", setMinigame);
	// let setSlot = await realmsClient.setToSlot(worldId, 1);
	// console.log("setSlot", setSlot);
	// let uploadInfo = await realmsClient.uploadInfo(worldId);
	// console.log(uploadInfo);

	// #endregion

	//#region  POST
	// let invitePlayer = await realmsClient.invitePlayer(worldId, "Plagypus");
	// console.log("invite Player", invitePlayer);
	// let makeOP = await realmsClient.makeOP(worldId, "64870cb3e3e14857bec6b9f597dc8b21");
	// console.log("makeOP", makeOP);
	// let setSettings = await realmsClient.setWorldSettings(worldId, {name: "§4P§8l§4a§8g§4'§8s §4R§8e§4a§8l§4m", description: "§81.17§r Survival§4'N'§rChill"});
	// let setSettings = await realmsClient.setWorldSettings(worldId, {name: "My place", description: "Motd!"});
	// console.log("set Settings", setSettings);
	// let resetWorld = await realmsClient.resetWorld(worldId, { seed: "1234", worldTemplateId: -1, generateStructures: true, levelType: 3 });
	// console.log("resetWorld", resetWorld);
	// let updateSlotSettings = await realmsClient.setSlotSettings(worldId, 1, { slotName: "Hallo" });
	// console.log("updateSlotSettings", updateSlotSettings);

	//#endregion

	//#region  DELETE
	// let kick = await realmsClient.kickPlayer(worldId, "64870cb3e3e14857bec6b9f597dc8b21");
	// console.log("kick", kick);
	// let deop = await realmsClient.deopPlayer(worldId, "64870cb3e3e14857bec6b9f597dc8b21");
	// console.log("deop", deop);
	// let leave = await realmsClient.leaveServer(worldId);
	// console.log("leave", leave);
	//#endregion



});

app.listen(3000);

async function fixedTest() {
	const token = "eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQwODU1MjA4MTAwNyIsInN1YiI6IjJiOTRjNmQ5LWY5MjktNGZmNy05ODFlLTQyNzhlYTMyZjk0NCIsIm5iZiI6MTYzMjQ4MzE1OSwiYXV0aCI6IlhCT1giLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwiZXhwIjoxNjMyNTY5NTU5LCJpYXQiOjE2MzI0ODMxNTksInBsYXRmb3JtIjoiVU5LTk9XTiIsInl1aWQiOiJlOWM3YjlmYzNjNTU0MTg5ODlhZDZiZjcxNmVmNTk0YSJ9.BqwUDZdBkU8cleFU3z1MRoPe2ripHfZI_UK3EJPRFoc";
	const uuid = "e75e2d263b724a93a3e7a2491f4c454f";
	const name = "Plagiatus";
	const worldId = 4156375;
	const realmsClient: JavaRealmsApiClient = new JavaRealmsApiClient("1.17.1", token, uuid, name);

	console.log("news", await realmsClient.getNews());
	console.log("pingresult", await realmsClient.regionPingResult());
	console.log("livestats", await realmsClient.getLiveStats(worldId));
	// console.log("init", await realmsClient.initialize(worldId, {description: "Desc", name: "Name"}));
	console.log("mco", await realmsClient.mcoAvailable());
	console.log("stage", await realmsClient.stageAvailable());
	// console.log("restore", await realmsClient.restoreWorld(worldId));
	console.log("trial", await realmsClient.trialAvailable());
	console.log("delete", await realmsClient.deleteWorld(worldId));
}

fixedTest();