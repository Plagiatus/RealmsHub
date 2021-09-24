//@ts-expect-error
import { XMLHttpRequest } from "xmlhttprequest";

export default class JavaRealmsApiClient {
	private accessToken: string;
	private playerUuid: string;
	private playerName: string;
	private static gameVersion: string;
	private static apiUrl: string = "https://pc.realms.minecraft.net"

	constructor(_gameVersion: string, _accessToken: string, _uuid: string, _name?: string) {
		this.accessToken = _accessToken;
		this.playerUuid = _uuid;
		if (!_name) {
			this.playerName = "Plagiatus";
		} else {
			this.playerName = _name;
		}
		JavaRealmsApiClient.gameVersion = _gameVersion;
	}


	private get cookie(): string {
		return "sid=token:" + this.accessToken + ":" + this.playerUuid + ";user=" + this.playerName + ";version=" + JavaRealmsApiClient.gameVersion;
	}


	private async sendGetRequest(_url: string): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_url, "GET");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		request.send()
		return promise;
	}
	private async sendPostRequest(_url: string, _data?: any): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_url, "POST");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		if (_data)
			request.send(JSON.stringify(_data));
		else
			request.send();
		return promise;
	}
	private async sendPutRequest(_url: string): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_url, "PUT");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		request.send();
		return promise;
	}
	private async sendDeleteRequest(_url: string): Promise<any | RequestError> {
		let request: XMLHttpRequest = this.createRequest(_url, "DELETE");
		let promise: Promise<any> = this.waitForRequestResponse(request);
		request.send();
		return promise;
	}

	private createRequest(_url: string, _method: RequestMethod): XMLHttpRequest {
		let request = new XMLHttpRequest();
		request.open(_method, _url);
		request.setDisableHeaderCheck(true);
		request.setRequestHeader("Cookie", this.cookie);
		if (_method == "POST")
			request.setRequestHeader("Content-Type", "application/json");
		return request;
	}

	private async waitForRequestResponse(req: XMLHttpRequest): Promise<any | RequestError> {
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

	//#region CORE requests
	//#region GET requests
	public async compatible(): Promise<Compatible> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/client/compatible");
		return result;
	}

	public async worlds(): Promise<RealmsServer[]> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds");
		return JSON.parse(result);
	}

	public async world(_worldId: number): Promise<RealmsServer> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId);
		return JSON.parse(result);
	}

	public async ip(_worldId: number): Promise<Ip | string> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/v1/" + _worldId + "/join/pc");
		if (result == "Retry again later")
			return result;
		return JSON.parse(result);
	}

	public async backups(_worldId: number): Promise<Backups> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups");
		return JSON.parse(result);
	}

	public async downloadLatestBackup(_worldId: number, _slot: SlotNumber): Promise<BackupDownload> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot + "/download");
		return JSON.parse(result);
	}

	public async getOps(_worldId: number): Promise<string[]> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId);
		return JSON.parse(result);
	}

	public async subscriptions(_worldId: number): Promise<SubscriptionInfo> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/subscriptions/" + _worldId);
		return JSON.parse(result);
	}

	public async inviteCount(): Promise<number> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/invites/count/pending");
		return result;
	}

	public async invites(): Promise<Invites> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/invites/pending");
		return JSON.parse(result);
	}

	public async templates(_type: TemplateType, _page: number, _pageSize: number = 10): Promise<Templates> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/templates/" + _type + "?page=" + _page + "&pageSize=" + _pageSize);
		return JSON.parse(result);
	}
	//#endregion

	//#region POST requests
	public async makeOP(_worldId: number, _playerUUID: string): Promise<Ops> {
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId + "/" + _playerUUID, undefined);
		return JSON.parse(result);
	}

	public async invitePlayer(_worldId: number, _playerName?: string, _playerUUID?: string): Promise<RealmsServer> {
		let data: { name?: string, uuid?: string } = {};
		if (_playerName) data.name = _playerName;
		else data.uuid = _playerUUID;
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId, data);
		return JSON.parse(result);
	}

	public async resetWorld(_worldId: number, _settings: RealmWorldResetSettings): Promise<any> {
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/reset", _settings);
		return JSON.parse(result);
	}

	public async resetWorldToSeed(_worldId: number, _seed: string, _levelType: LevelType, _generateStructures: boolean) {
		return this.resetWorld(_worldId, { generateStructures: _generateStructures, levelType: _levelType, seed: _seed, worldTemplateId: -1 })
	}

	public async resetWorldToTemplate(_worldId: number, _templateId: number) {
		return this.resetWorld(_worldId, { generateStructures: false, levelType: -1, seed: "", worldTemplateId: _templateId })
	}

	public async setWorldSettings(_worldId: number, _settings: RealmSettings): Promise<any> {
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId, _settings);
		return JSON.parse(result);
	}

	public async setSlotSettings(_worldId: number, _slot: SlotNumber, _settings: SlotSettings): Promise<any> {
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot, _settings);
		return result;
	}
	//#endregion

	//#region PUT requests
	public async acceptInvite(_invitationId: string): Promise<boolean> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/invites/accept/" + _invitationId);
		return result;
	}
	public async rejectInvite(_invitationId: string): Promise<boolean> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/invites/reject/" + _invitationId);
		return result;
	}
	public async openRealm(_worldId: number): Promise<boolean> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/open");
		return result;
	}
	public async closeRealm(_worldId: number): Promise<boolean> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/close");
		return result;
	}

	public async setToMinigame(_worldId: number, _minigameId: number): Promise<boolean> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/minigames/" + _minigameId + "/" + _worldId);
		return !!result;
	}
	public async setToSlot(_worldId: number, _slot: SlotNumber): Promise<boolean> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot);
		return result;
	}
	/**
	 * Closes the world to allow you to upload a new world.
	 */
	public async uploadInfo(_worldId: number): Promise<UploadInfo> {
		let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups/upload");
		return result;
	}
	//#endregion

	//#region DELETE requests
	public async kickPlayer(_worldId: number, _playerUUID: string): Promise<boolean> {
		let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId + "/invite/" + _playerUUID);
		return result;
	}
	public async deopPlayer(_worldId: number, _playerUUID: string): Promise<Ops> {
		let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId + "/" + _playerUUID);
		return JSON.parse(result);
	}
	public async leaveServer(_worldId: number): Promise<any> {
		let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId);
		return result;
	}
	//#endregion
	//#endregion

	//#region OTHER requests
	public async getNews(): Promise<News> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/v1/news");
		return JSON.parse(result);
	}

	/** No idea what this does. */
	public async regionPingResult(): Promise<any> {
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/regions/ping/stat");
		return result;
	}

	public async getLiveStats(_worldId: number): Promise<Livestats> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/activities/liveplayerlist");
		return JSON.parse(result);
	}

	// public async initialize(_worldId: number, _settings: RealmSettings): Promise<any> {
	// 	let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/initialize");
	// 	return result;
	// }

	public async mcoAvailable(): Promise<any> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/available");
		return result;
	}

	public async stageAvailable(): Promise<any> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/stageAvailable");
		return result;
	}

	// public async restoreWorld(_worldId: number): Promise<any> {
	// 	let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups");
	// 	return result;
	// }

	public async agreeToTos(_worldId: number): Promise<any> {
		let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/mco/tos/agreed");
		return result;
	}

	public async trialAvailable(): Promise<boolean> {
		let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/trial");
		return result;
	}

	/** Doesn't seem to be doing anything. */
	public async deleteWorld(_worldId: number): Promise<boolean> {
		let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId);
		return result;
	}

	//#endregion
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type Compatible = "COMPATIBLE" | "OUTDATED" | "OTHER";
type WorldType = "NORMAL" | "ADVENTUREMAP" | "MINIGAME";
type TemplateType = "MINIGAME" | "ADVENTUREMAP" | "EXERIENCE" | "NORMAL" | "INSPIRATION";
type SlotNumber = 1 | 2 | 3;
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
	permission: "MEMBER" | "OPERATOR",
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
		world_type: WorldType
	}
}

interface BackupDownload {
	downloadLink: string,
	resourcePackUrl: string | null,
	resourcePackHash: string | null
}

interface SubscriptionInfo {
	startDate: number,
	daysLeft: number,
	subscriptionType: string
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

interface Templates {
	templates: Template[],
	page: number,
	size: number,
	total: number
}

interface Template {
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