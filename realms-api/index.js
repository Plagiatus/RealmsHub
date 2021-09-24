"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-expect-error
const xmlhttprequest_1 = require("xmlhttprequest");
class JavaRealmsApiClient {
    constructor(_gameVersion, _accessToken, _uuid, _name) {
        this.accessToken = _accessToken;
        this.playerUuid = _uuid;
        if (!_name) {
            this.playerName = "Plagiatus";
        }
        else {
            this.playerName = _name;
        }
        JavaRealmsApiClient.gameVersion = _gameVersion;
    }
    get cookie() {
        return "sid=token:" + this.accessToken + ":" + this.playerUuid + ";user=" + this.playerName + ";version=" + JavaRealmsApiClient.gameVersion;
    }
    async sendGetRequest(_url) {
        let request = this.createRequest(_url, "GET");
        let promise = this.waitForRequestResponse(request);
        request.send();
        return promise;
    }
    async sendPostRequest(_url, _data) {
        let request = this.createRequest(_url, "POST");
        let promise = this.waitForRequestResponse(request);
        if (_data)
            request.send(JSON.stringify(_data));
        else
            request.send();
        return promise;
    }
    async sendPutRequest(_url) {
        let request = this.createRequest(_url, "PUT");
        let promise = this.waitForRequestResponse(request);
        request.send();
        return promise;
    }
    async sendDeleteRequest(_url) {
        let request = this.createRequest(_url, "DELETE");
        let promise = this.waitForRequestResponse(request);
        request.send();
        return promise;
    }
    createRequest(_url, _method) {
        let request = new xmlhttprequest_1.XMLHttpRequest();
        request.open(_method, _url);
        request.setDisableHeaderCheck(true);
        request.setRequestHeader("Cookie", this.cookie);
        if (_method == "POST")
            request.setRequestHeader("Content-Type", "application/json");
        return request;
    }
    async waitForRequestResponse(req) {
        return new Promise((resolve, reject) => {
            req.addEventListener("readystatechange", () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        resolve(req.responseText);
                    }
                    else if (req.status == 204) {
                        resolve(true);
                    }
                    else {
                        let re = { code: req.status, message: req.statusText };
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
    async compatible() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/client/compatible");
        return result;
    }
    async worlds() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds");
        return JSON.parse(result);
    }
    async world(_worldId) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId);
        return JSON.parse(result);
    }
    async ip(_worldId) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/v1/" + _worldId + "/join/pc");
        if (result == "Retry again later")
            return result;
        return JSON.parse(result);
    }
    async backups(_worldId) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups");
        return JSON.parse(result);
    }
    async downloadLatestBackup(_worldId, _slot) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot + "/download");
        return JSON.parse(result);
    }
    async getOps(_worldId) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId);
        return JSON.parse(result);
    }
    async subscriptions(_worldId) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/subscriptions/" + _worldId);
        return JSON.parse(result);
    }
    async inviteCount() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/invites/count/pending");
        return result;
    }
    async invites() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/invites/pending");
        return JSON.parse(result);
    }
    async templates(_type, _page, _pageSize = 10) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/templates/" + _type + "?page=" + _page + "&pageSize=" + _pageSize);
        return JSON.parse(result);
    }
    //#endregion
    //#region POST requests
    async makeOP(_worldId, _playerUUID) {
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId + "/" + _playerUUID, undefined);
        return JSON.parse(result);
    }
    async invitePlayer(_worldId, _playerName, _playerUUID) {
        let data = {};
        if (_playerName)
            data.name = _playerName;
        else
            data.uuid = _playerUUID;
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId, data);
        return JSON.parse(result);
    }
    async resetWorld(_worldId, _settings) {
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/reset", _settings);
        return JSON.parse(result);
    }
    async resetWorldToSeed(_worldId, _seed, _levelType, _generateStructures) {
        return this.resetWorld(_worldId, { generateStructures: _generateStructures, levelType: _levelType, seed: _seed, worldTemplateId: -1 });
    }
    async resetWorldToTemplate(_worldId, _templateId) {
        return this.resetWorld(_worldId, { generateStructures: false, levelType: -1, seed: "", worldTemplateId: _templateId });
    }
    async setWorldSettings(_worldId, _settings) {
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId, _settings);
        return JSON.parse(result);
    }
    async setSlotSettings(_worldId, _slot, _settings) {
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot, _settings);
        return result;
    }
    //#endregion
    //#region PUT requests
    async acceptInvite(_invitationId) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/invites/accept/" + _invitationId);
        return result;
    }
    async rejectInvite(_invitationId) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/invites/reject/" + _invitationId);
        return result;
    }
    async openRealm(_worldId) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/open");
        return result;
    }
    async closeRealm(_worldId) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/close");
        return result;
    }
    async setToMinigame(_worldId, _minigameId) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/minigames/" + _minigameId + "/" + _worldId);
        return !!result;
    }
    async setToSlot(_worldId, _slot) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot);
        return result;
    }
    /**
     * Closes the world to allow you to upload a new world.
     */
    async uploadInfo(_worldId) {
        let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups/upload");
        return result;
    }
    //#endregion
    //#region DELETE requests
    async kickPlayer(_worldId, _playerUUID) {
        let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId + "/invite/" + _playerUUID);
        return result;
    }
    async deopPlayer(_worldId, _playerUUID) {
        let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId + "/" + _playerUUID);
        return JSON.parse(result);
    }
    async leaveServer(_worldId) {
        let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId);
        return result;
    }
    //#endregion
    //#endregion
    //#region OTHER requests
    async getNews() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/v1/news");
        return JSON.parse(result);
    }
    /** No idea what this does. */
    async regionPingResult() {
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/regions/ping/stat");
        return result;
    }
    async getLiveStats(_worldId) {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/activities/liveplayerlist");
        return JSON.parse(result);
    }
    // public async initialize(_worldId: number, _settings: RealmSettings): Promise<any> {
    // 	let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/initialize");
    // 	return result;
    // }
    async mcoAvailable() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/available");
        return result;
    }
    async stageAvailable() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/stageAvailable");
        return result;
    }
    // public async restoreWorld(_worldId: number): Promise<any> {
    // 	let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups");
    // 	return result;
    // }
    async agreeToTos(_worldId) {
        let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/mco/tos/agreed");
        return result;
    }
    async trialAvailable() {
        let result = await this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/trial");
        return result;
    }
    /** Doesn't seem to be doing anything. */
    async deleteWorld(_worldId) {
        let result = await this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId);
        return result;
    }
}
exports.default = JavaRealmsApiClient;
JavaRealmsApiClient.apiUrl = "https://pc.realms.minecraft.net";
