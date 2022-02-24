//@ts-expect-error
import { XMLHttpRequest } from "xmlhttprequest";
import { XboxServiceTokenResponse } from "../ms-api"

abstract class RealmsClient {
	protected gameVersion: string;

	constructor(_gameVersion: string) {
		this.gameVersion = _gameVersion;
	}

	protected async sendGetRequest(_path: string): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_path, "GET");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		request.send()
		return promise;
	}
	protected async sendPostRequest(_path: string, _data?: any): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_path, "POST");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		if (_data)
			request.send(JSON.stringify(_data));
		else
			request.send();
		return promise;
	}
	protected async sendPutRequest(_path: string, _data?: any): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_path, "PUT");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		if (_data)
			request.send(JSON.stringify(_data));
		else
			request.send();
		return promise;
	}
	protected async sendDeleteRequest(_path: string): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_path, "DELETE");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		request.send();
		return promise;
	}

	protected async waitForRequestResponse(req: XMLHttpRequest): Promise<any | RequestError> {
		return new Promise((resolve, reject) => {
			req.addEventListener("readystatechange", () => {
				if (req.readyState == 4) {
					if (req.status == 200) {
						resolve(req.responseText);
					} else if (req.status == 204) {
						resolve(true);
					} else {
						let re: RequestError = { code: req.status, message: req.statusText };
						console.error(req.status, req.statusText);
						if (req.responseText != "")
							resolve(req.responseText);
						else
							resolve(JSON.stringify(re));
					}
				}
			});
		});
	}

	protected abstract createRequest(s: string, rm: RequestMethod): XMLHttpRequest;
}

export class RealmsClientJava extends RealmsClient {
	private accessToken: string;
	private playerUuid: string;
	private playerName: string;
	private pe: boolean;

	constructor(_gameVersion: string, _accessToken: string, _uuid: string, _name: string, _pe: boolean = false) {
		super(_gameVersion);
		this.accessToken = _accessToken;
		this.playerUuid = _uuid;
		this.playerName = _name;
		this.pe = _pe;
	}

	private get cookie(): string {
		return "sid=token:" + this.accessToken + ":" + this.playerUuid + ";user=" + this.playerName + ";version=" + this.gameVersion;
	}

	protected createRequest(_path: string, _method: RequestMethod): XMLHttpRequest {
		let url = "https://pc.realms.minecraft.net" + _path;
		let request = new XMLHttpRequest();
		request.open(_method, url);
		request.setDisableHeaderCheck(true);
		request.setRequestHeader("Cookie", this.cookie);
		if (_method == "POST")
			request.setRequestHeader("Content-Type", "application/json");
		return request;
	}

	//#region CORE requests
	//#region GET requests
	public async compatible(): Promise<Compatible> {
		let result = await this.sendGetRequest("/mco/client/compatible");
		return result;
	}

	public async worlds(): Promise<RealmsServer[]> {
		let result = await this.sendGetRequest("/worlds");
		return JSON.parse(result);
	}

	public async world(_worldId: number): Promise<RealmsServer> {
		let result = await this.sendGetRequest("/worlds/" + _worldId);
		return JSON.parse(result);
	}

	public async ip(_worldId: number): Promise<Ip | string> {
		let result = await this.sendGetRequest("/worlds/v1/" + _worldId + "/join/pc");
		if (result == "Retry again later")
			return result;
		return JSON.parse(result);
	}

	public async backups(_worldId: number): Promise<Backups> {
		let result = await this.sendGetRequest("/worlds/" + _worldId + "/backups");
		return JSON.parse(result);
	}

	public async downloadLatestBackup(_worldId: number, _slot: SlotNumber): Promise<BackupDownload> {
		let result = await this.sendGetRequest("/worlds/" + _worldId + "/slot/" + _slot + "/download");
		return JSON.parse(result);
	}

	public async getOps(_worldId: number): Promise<string[]> {
		let result = await this.sendGetRequest("/ops/" + _worldId);
		return JSON.parse(result);
	}

	public async subscriptions(_worldId: number): Promise<SubscriptionInfo> {
		let result = await this.sendGetRequest("/subscriptions/" + _worldId);
		return JSON.parse(result);
	}

	public async inviteCount(): Promise<number> {
		let result = await this.sendGetRequest("/invites/count/pending");
		return result;
	}

	public async invites(): Promise<Invites> {
		let result = await this.sendGetRequest("/invites/pending");
		return JSON.parse(result);
	}

	public async templates(_type: TemplateType, _page: number, _pageSize: number = 10): Promise<Templates> {
		let result = await this.sendGetRequest("/worlds/templates/" + _type + "?page=" + _page + "&pageSize=" + _pageSize);
		return JSON.parse(result);
	}
	//#endregion

	//#region POST requests
	public async makeOP(_worldId: number, _playerUUID: string): Promise<Ops> {
		let result = await this.sendPostRequest("/ops/" + _worldId + "/" + _playerUUID, undefined);
		return JSON.parse(result);
	}

	public async invitePlayer(_worldId: number, _playerName?: string, _playerUUID?: string): Promise<RealmsServer> {
		let data: { name?: string, uuid?: string } = {};
		if (_playerName) data.name = _playerName;
		else data.uuid = _playerUUID;
		let result = await this.sendPostRequest("/invites/" + _worldId, data);
		return JSON.parse(result);
	}

	public async resetWorld(_worldId: number, _settings: RealmWorldResetSettings): Promise<any> {
		let result = await this.sendPostRequest("/worlds/" + _worldId + "/reset", _settings);
		return result;
	}

	public async resetWorldToSeed(_worldId: number, _seed: string, _levelType: LevelType, _generateStructures: boolean) {
		return this.resetWorld(_worldId, { generateStructures: _generateStructures, levelType: _levelType, seed: _seed, worldTemplateId: -1 })
	}

	public async resetWorldToTemplate(_worldId: number, _templateId: number) {
		return this.resetWorld(_worldId, { generateStructures: false, levelType: -1, seed: "", worldTemplateId: _templateId })
	}

	public async setWorldSettings(_worldId: number, _settings: RealmSettings): Promise<any> {
		let result = await this.sendPostRequest("/worlds/" + _worldId, _settings);
		return JSON.parse(result);
	}

	public async setSlotSettings(_worldId: number, _slot: SlotNumber, _settings: SlotSettings): Promise<any> {
		let result = await this.sendPostRequest("/worlds/" + _worldId + "/slot/" + _slot, _settings);
		return result;
	}
	//#endregion

	//#region PUT requests
	public async acceptInvite(_invitationId: string): Promise<boolean> {
		let result = await this.sendPutRequest("/invites/accept/" + _invitationId);
		return result;
	}
	public async rejectInvite(_invitationId: string): Promise<boolean> {
		let result = await this.sendPutRequest("/invites/reject/" + _invitationId);
		return result;
	}
	public async openRealm(_worldId: number): Promise<boolean> {
		let result = await this.sendPutRequest("/worlds/" + _worldId + "/open");
		return result;
	}
	public async closeRealm(_worldId: number): Promise<boolean> {
		let result = await this.sendPutRequest("/worlds/" + _worldId + "/close");
		return result;
	}

	public async setToMinigame(_worldId: number, _minigameId: number): Promise<boolean> {
		let result = await this.sendPutRequest("/worlds/minigames/" + _minigameId + "/" + _worldId);
		return !!result;
	}
	public async setToSlot(_worldId: number, _slot: SlotNumber): Promise<boolean> {
		let result = await this.sendPutRequest("/worlds/" + _worldId + "/slot/" + _slot);
		return result;
	}
	/**
	 * Closes the world to allow you to upload a new world.
	 */
	public async uploadInfo(_worldId: number): Promise<UploadInfo> {
		let result = await this.sendPutRequest("/worlds/" + _worldId + "/backups/upload");
		return result;
	}
	//#endregion

	//#region DELETE requests
	public async kickPlayer(_worldId: number, _playerUUID: string): Promise<boolean> {
		let result = await this.sendDeleteRequest("/invites/" + _worldId + "/invite/" + _playerUUID);
		return result;
	}
	public async deopPlayer(_worldId: number, _playerUUID: string): Promise<Ops> {
		let result = await this.sendDeleteRequest("/ops/" + _worldId + "/" + _playerUUID);
		return JSON.parse(result);
	}
	public async leaveServer(_worldId: number): Promise<any> {
		let result = await this.sendDeleteRequest("/invites/" + _worldId);
		return result;
	}
	//#endregion
	//#endregion

	//#region OTHER requests
	public async getNews(): Promise<News> {
		let result = await this.sendGetRequest("/mco/v1/news");
		return JSON.parse(result);
	}

	/** No idea what this does. */
	public async regionPingResult(): Promise<any> {
		let result = await this.sendPostRequest("/regions/ping/stat");
		return result;
	}

	public async getLiveStats(_worldId: number): Promise<Livestats> {
		let result = await this.sendGetRequest("/activities/liveplayerlist");
		return JSON.parse(result);
	}

	// public async initialize(_worldId: number, _settings: RealmSettings): Promise<any> {
	// 	let result = await this.sendPostRequest("/worlds/" + _worldId + "/initialize");
	// 	return result;
	// }

	public async mcoAvailable(): Promise<any> {
		let result = await this.sendGetRequest("/mco/available");
		return result;
	}

	public async stageAvailable(): Promise<any> {
		let result = await this.sendGetRequest("/mco/stageAvailable");
		return result;
	}

	// public async restoreWorld(_worldId: number): Promise<any> {
	// 	let result = await this.sendPutRequest("/worlds/" + _worldId + "/backups");
	// 	return result;
	// }

	public async agreeToTos(): Promise<any> {
		let result = await this.sendPostRequest("/mco/tos/agreed");
		return result;
	}

	public async trialAvailable(): Promise<boolean> {
		let result = await this.sendGetRequest("/trial");
		return result;
	}

	/** Doesn't seem to be doing anything. */
	public async deleteWorld(_worldId: number): Promise<boolean> {
		let result = await this.sendDeleteRequest("/worlds/" + _worldId);
		return result;
	}

	// public async buy(): Promise<BuyMessage> {
	// 	let result = await this.sendGetRequest("/mco/buy");
	// 	return JSON.parse(result);
	// }

	//#endregion
}

interface XSTSToken {
	userhash: string,
	token: string,
}

export class RealmsClientBedrock extends RealmsClient {

	private xstsBedrock: XSTSToken;
	private xstsXbox: XSTSToken;

	constructor(_gameVersion: string, _xstsBr: XboxServiceTokenResponse, _xstsXbox: XboxServiceTokenResponse) {
		super(_gameVersion);
		this.xstsBedrock = { token: _xstsBr.Token, userhash: _xstsBr.DisplayClaims.xui[0].uhs };
		this.xstsXbox = { token: _xstsXbox.Token, userhash: _xstsXbox.DisplayClaims.xui[0].uhs };
	}

	private accessToken(xsts: XSTSToken = this.xstsBedrock): string {
		return `XBL3.0 x=${xsts.userhash};${xsts.token}`;
	}

	protected createRequest(_url: string, _method: RequestMethod, _xsts: XSTSToken = this.xstsBedrock): XMLHttpRequest {
		let url = "https://pocket.realms.minecraft.net" + _url;
		let request = new XMLHttpRequest();
		request.open(_method, url);
		request.setDisableHeaderCheck(true);
		request.setRequestHeader("Authorization", this.accessToken(_xsts));
		request.setRequestHeader("User-Agent", "MCPE/UWP");
		request.setRequestHeader("Client-Version", this.gameVersion);
		request.setRequestHeader("Accept-Language", "en_us");
		// request.setRequestHeader("Accept-Encoding", "gzip, deflate, br");
		// request.setRequestHeader("Accept", "*/*")
		// request.setRequestHeader("Cache-Control", "no-cache")
		// request.setRequestHeader("Charset", "utf-8")
		request.withCredentials = true;

		if (_method == "POST")
			request.setRequestHeader("Content-Type", "application/json");
		return request;
	}

	public async getPlayerInformation(...xuids: string[]): Promise<XboxPlayerInfo[] | RequestError> {
		if (xuids.length == 0) return [];
		let url: string = `https://peoplehub.xboxlive.com/users/me/people/xuids(${xuids.toString()})`;
		let request: XMLHttpRequest = new XMLHttpRequest();
		request.open("GET", url);
		request.setRequestHeader("Authorization", this.accessToken(this.xstsXbox));
		request.setRequestHeader("x-xbl-contract-version", 4);
		request.setRequestHeader("Accept", "application/json");
		request.setRequestHeader("Accept-Language", "en_us");

		return this.waitForRequestResponse(request);
	}

	//#region CORE requests
	//#region GET requests
	public async compatible(): Promise<Compatible> {
		let result = await this.sendGetRequest("/mco/client/compatible");
		return result;
	}

	public async worlds(): Promise<RealmsServer[]> {
		let result = await this.sendGetRequest("/worlds");
		return result;
	}

	public async world(_worldId: number): Promise<RealmsServer> {
		let result = await this.sendGetRequest(`/worlds/${_worldId}`);
		return result;
	}

	public async ip(_worldId: number): Promise<Ip | string> {
		let result = await this.sendGetRequest(`/server/${_worldId}/join`);
		return result;
	}

	public async backups(_worldId: number): Promise<Backups> {
		let result = await this.sendGetRequest(`/worlds/${_worldId}/backups`);
		return result;
	}

	public async downloadBackup(_worldId: number, _backupId: string = "latest", _slot: SlotNumber = 1): Promise<BackupDownloadBedrock> {
		let result = await this.sendGetRequest(`/archive/download/world/${_worldId}/${_slot}/${_backupId}`);
		return result;
	}

	public async inviteLinks(_worldId: number): Promise<InviteLink[]> {
		let result = await this.sendGetRequest(`/links/v1?worldId=${_worldId}`);
		return result;
	}

	public async infoAboutInviteCode(_code: number): Promise<RealmsServer> {
		let result = await this.sendGetRequest(`/worlds/v1/link/${_code}`);
		return result;
	}

	public async blockedPlayers(_worldId: number): Promise<string[]> {
		let result = await this.sendGetRequest(`/worlds/${_worldId}/blocklist`);
		return result;
	}

	public async subscriptions(_worldId: number): Promise<SubscriptionInfoBedrock> {
		let result = await this.sendGetRequest(`/worlds/${_worldId}/blocklist`);
		return result;
	}

	public async inviteCount(): Promise<number> {
		let result = await this.sendGetRequest(`/invites/count/pending`);
		return result;
	}

	public async invites(): Promise<number> {
		let result = await this.sendGetRequest(`/invites/`);
		return result;
	}
	//#endregion
	//#region POST requests
	public async joinRealmThroughCode(_code: string): Promise<RealmsServer> {
		let result = await this.sendPostRequest(`/invites/v1/link/accept/${_code}`);
		return result;
	}

	public async applyContent(_worldId: number, _packUUIDs: string[]): Promise<RealmsServer> {
		let result = await this.sendPostRequest(`/world/${_worldId}/content/`, _packUUIDs);
		return result;
	}

	public async setWorldSettings(_worldId: number, _settings: BedrockRealmSettings): Promise<any> {
		let result = await this.sendPostRequest(`/world/${_worldId}/configuration/`, _settings);
		return result;
	}

	public async blockUser(_worldId: number, _xuid: string): Promise<void> {
		let result = await this.sendPostRequest(`/world/${_worldId}/blocklist/${_xuid}`);
		return result;
	}

	//#endregion
	//#region PUT requests
	public async kickPlayers(_worldId: number, _xuids: string[]): Promise<RealmsServer> {
		let data: any = { invites: {} };
		for (let xuid of _xuids) {
			data.invites[xuid] = "REMOVE";
		}
		let result = await this.sendPutRequest(`/invites/${_worldId}/invite/update`, data);
		return result;
	}

	public async invitePlayers(_worldId: number, _xuids: string[]): Promise<RealmsServer> {
		let data: any = { invites: {} };
		for (let xuid of _xuids) {
			data.invites[xuid] = "ADD";
		}
		let result = await this.sendPutRequest(`/invites/${_worldId}/invite/update`, data);
		return result;
	}

	public async defaultPermission(_worldId: number, _permission: Permission): Promise<void> {
		let result = await this.sendPutRequest(`/worlds/${_worldId}/defaultPermission`, { permission: _permission });
		return result;
	}

	public async changeUserPermission(_worldId: number, _xuid: string, _permission: Permission): Promise<void> {
		let result = await this.sendPutRequest(`/worlds/${_worldId}/userPermission`, { permission: _permission, xuid: _xuid });
		return result;
	}

	public async setToSlot(_worldId: number, _slot: SlotNumber): Promise<boolean> {
		let result = await this.sendPutRequest(`/worlds/${_worldId}/slot/${_slot}`);
		return result;
	}

	public async openRealm(_worldId: number): Promise<boolean> {
		let result = await this.sendPutRequest(`/worlds/${_worldId}/open`);
		return result;
	}

	public async closeRealm(_worldId: number): Promise<boolean> {
		let result = await this.sendPutRequest(`/worlds/${_worldId}/close`);
		return result;
	}

	public async resetRealm(_worldId: number): Promise<any> {
		let result = await this.sendPutRequest(`/worlds/${_worldId}/reset`);
		return result;
	}

	public async forceResourcepackOnJoin(_worldId: number): Promise<any> {
		let result = await this.sendPutRequest(`/world/${_worldId}/content/texturePacksRequired`);
		return result;
	}

	public async acceptInvite(_worldId: number): Promise<any> {
		let result = await this.sendPutRequest(`/invites/accept/${_worldId}`);
		return result;
	}
	//#endregion
	//#region DELETE requests
	public async unblockUser(_worldId: number, _xuid: string): Promise<void> {
		let result = await this.sendDeleteRequest(`/worlds/${_worldId}/blocklist/${_xuid}`);
		return result;
	}

	public async rejectInvite(_worldId: number): Promise<void> {
		let result = await this.sendDeleteRequest(`/invites/${_worldId}`);
		return result;
	}

	public async leaveServer(_worldId: number): Promise<void> {
		let result = await this.sendDeleteRequest(`/worlds/${_worldId}`);
		return result;
	}
	
	public async dontForceResourcepackOnJoin(_worldId: number): Promise<any> {
		let result = await this.sendDeleteRequest(`/world/${_worldId}/content/texturePacksRequired`);
		return result;
	}
	//#endregion
	//#endregion


	//#region OTHER requests
	//#region GET requests
	public async trial(): Promise<string> {
		let result = await this.sendGetRequest(`/trial/new`);
		return result;
	}

	public async livePlayers(): Promise<PlayerInfoOnServers> {
		let result = await this.sendGetRequest(`/activities/live/players`);
		return result;
	}
	//#endregion
	//#region POST requests
	public async validateClubs(): Promise<PlayerInfoOnServers> {
		let result = await this.sendPostRequest(`/clubs/validate`);
		return result;
	}

	public async clearMembers(_worldId: number): Promise<any> {
		let result = await this.sendPostRequest(`/invites/${_worldId}/invite/update`, { invites: null });
		return result;
	}

	public async initializeDEV(_worldId: number): Promise<any> {
		let result = await this.sendPostRequest(`/worlds/${_worldId}/initialize`, { invites: null });
		return result;
	}

	public async editConfigDEV(_worldId: number): Promise<any> {
		let result = await this.sendPostRequest(`/worlds/${_worldId}/configuration/dev`, { invites: null });
		return result;
	}
	//#endregion
	//#region PUT requests

	//#endregion
	//#region DELETE requests

	//#endregion
	//#endregion
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type Compatible = "COMPATIBLE" | "OUTDATED" | "OTHER";
export type WorldType = "NORMAL" | "ADVENTUREMAP" | "MINIGAME";
export type TemplateType = "MINIGAME" | "ADVENTUREMAP" | "EXPERIENCE" | "NORMAL" | "INSPIRATION";
export type SlotNumber = 1 | 2 | 3;
type Permission = "MEMBER" | "OPERATOR" | "VISITOR";
/**
 * 0: default  
 * 1: superflat  
 * 2: large biomes  
 * 3: amplified  
 * -1: none   
 */
type LevelType = 0 | 1 | 2 | 3 | -1;

interface RealmsServer {
	id: number,
	remoteSubscriptionId: string,
	owner: string,
	ownerUUID: string,
	name: string,
	motd: string,
	state: string,
	daysLeft: number,
	expired: boolean,
	expiredTrial: boolean,
	gracePeriod: boolean,
	worldType: WorldType,
	players: RealmsPlayer[] | null,
	maxPlayers: number,
	minigameName: string | null,
	minigameId: number | null,
	minigameImage: string | null,
	activeSlot: SlotNumber,
	slots: Slot[] | null,
	member: boolean,
	clubId: number,
	subscriptionRefreshStatus: any | null,
}

interface RealmsPlayer {
	uuid: string,
	name: string,
	operator: boolean,
	accepted: boolean,
	online: boolean,
	permission: Permission,
}

interface RequestError {
	code: number,
	message: string,
}

interface Slot {
	options: JSON,
	slotId: SlotNumber
}

interface SlotSettings {
	slotName?: string,
	pvp?: boolean,
	spawnAnimals?: boolean,
	spawnMonsters?: boolean,
	spawnNPCs?: boolean,
	spawnProtection?: number,
	commandBlocks?: boolean,
	forceGameMode?: boolean,
	gameMode?: number,
	difficulty?: number,
	worldTemplateId?: number,
	worldTemplateImage?: string,
	adventureMap?: boolean,
	resourcePackHash?: null
}

interface Ip {
	address: string,
	pendingUpdate: boolean
}

interface Backups {
	backups: Backup[]
}

interface Backup {
	backupId: string,
	lastModifiedDate: number,
	size: number,
	metadata: {
		game_difficulty: string,
		name: string,
		game_server_version: string,
		description: string,
		game_mode: string,
		world_type: WorldType,
		enabled_packs: {
			behaviorPacks: any[],
			resourcePacks: any[],
		}
	}
}

interface BackupDownload {
	downloadLink: string,
	resourcePackUrl: string | null,
	resourcePackHash: string | null
}

interface BackupDownloadBedrock {
	downloadUrl: string,
	token: string | null,
	size: number | null
}

interface SubscriptionInfo {
	startDate: number,
	daysLeft: number,
	subscriptionType: string
}
interface SubscriptionInfoBedrock {
	type: string,
	store: string,
	startDate: number,
	endDate: number,
	daysLeft: number,
	subscriptionId: string,
}

interface Invites {
	invites: Invite[]
}

interface Invite {
	invitationId: string,
	worldName: string,
	worldDescription: string,
	worldOwnerName: string,
	worldOwnerUuid: string,
	date: number
}

export interface Templates {
	templates: Template[],
	page: number,
	size: number,
	total: number
}

export interface Template {
	id: number,
	name: string,
	version: string,
	author: string,
	link: string,
	image: string,
	trailer: string,
	recommendedPlayers: string,
	type: TemplateType
}

interface Ops {
	ops: string[];
}

interface RealmSettings {
	name: string,
	description: string
}

interface UploadInfo {
	worldClosed: boolean,
	token: string,
	uploadEndpoint: string,
	port: number
}

interface RealmWorldResetSettings {
	seed: string,
	worldTemplateId: number,
	levelType: LevelType,
	generateStructures: boolean
}

interface News {
	newsLink: string
}

interface Livestats {
	lists: PlayerStats[]
}

interface PlayerStats {
	serverId: number,
	playerList: string;
}

interface PlayerSessionInfo {
	activeSessionId: any,
	deviceSessionId: any,
	clientId: any,
	globalMultiplayerCorrelationId: any,
	playerId: string
}

interface BuyMessage {
	statusMessage: string,
	buyLink: string
}

interface XboxPlayerInfo {
	xuid: string,
	displayName: string,
	displayPicRaw: string,
	gamertag: string,
}

interface InviteLink {
	linkId: string,
	profileUuid: string,
	type: string,
	ts: number,
	url: string,
	deepLinkUrl: string,
}

interface PlayerInfoOnServers {
	servers: PlayerInfoOnServer[],
}

interface PlayerInfoOnServer {
	id: number,
	players: RealmsPlayer[],
	full: boolean,
}

interface BedrockRealmSettings {
	description?: {
		description: string,
		name: string,
	},
	options?: {
		adventureMap?: boolean,
		cheatsAllowed?: boolean,
		commandBlocks?: boolean,
		customGameServerGlobalProperties?: null,
		difficulty?: number,
		enabledPacks?: {
			behaviorPacks?: [],
			resourcePacks?: [],
		},
		forceGameMode?: boolean,
		gameMode?: number,
		incompatibilities?: any[],
		pvp?: boolean,
		resourcePackHash?: string,
		slotName?: string,
		spawnAnimals?: boolean,
		spawnMonsters?: boolean,
		spawnNPCs?: boolean,
		spawnProtection?: number,
		texturePacksRequired?: boolean,
		timeRequest?: null,
		versionLock?: boolean,
		versionRef?: string,
		worldSettings?: {},
		worldTemplateId?: number,
		worldTemplateImage?: null,
	}
}