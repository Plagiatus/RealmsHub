"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-expect-error
var xmlhttprequest_1 = require("xmlhttprequest");
var RealmsClient = /** @class */ (function () {
    function RealmsClient(_gameVersion, _accessToken, _uuid, _name, _pe) {
        if (_pe === void 0) { _pe = false; }
        this.accessToken = _accessToken;
        this.playerUuid = _uuid;
        this.playerName = _name;
        this.gameVersion = _gameVersion;
        this.pe = _pe;
    }
    Object.defineProperty(RealmsClient.prototype, "cookie", {
        get: function () {
            return "sid=token:" + this.accessToken + ":" + this.playerUuid + ";user=" + this.playerName + ";version=" + this.gameVersion;
        },
        enumerable: false,
        configurable: true
    });
    RealmsClient.prototype.sendGetRequest = function (_url) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_url, "GET");
                promise = this.waitForRequestResponse(request);
                request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.sendPostRequest = function (_url, _data) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_url, "POST");
                promise = this.waitForRequestResponse(request);
                if (_data)
                    request.send(JSON.stringify(_data));
                else
                    request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.sendPutRequest = function (_url) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_url, "PUT");
                promise = this.waitForRequestResponse(request);
                request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.sendDeleteRequest = function (_url) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_url, "DELETE");
                promise = this.waitForRequestResponse(request);
                request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.createRequest = function (_url, _method) {
        if (!this.pe) {
            var url = "https://pc.realms.minecraft.net" + _url;
            var request = new xmlhttprequest_1.XMLHttpRequest();
            request.open(_method, url);
            request.setDisableHeaderCheck(true);
            request.setRequestHeader("Cookie", this.cookie);
            if (_method == "POST")
                request.setRequestHeader("Content-Type", "application/json");
            return request;
        }
        else {
            var url = "https://pocket.realms.minecraft.net" + _url;
            var request = new xmlhttprequest_1.XMLHttpRequest();
            request.open(_method, url);
            request.setDisableHeaderCheck(true);
            request.setRequestHeader("Authorization", "XBL3.0 " + this.accessToken);
            request.setRequestHeader("User-Agent", "MCPE/UWP");
            request.setRequestHeader("Client-Version", this.gameVersion);
            // request.setRequestHeader("Accept-Language", "en-GB");
            // request.setRequestHeader("Accept-Encoding", "gzip, deflate, br");
            // request.setRequestHeader("Accept", "*/*")
            // request.setRequestHeader("Cache-Control", "no-cache")
            // request.setRequestHeader("Charset", "utf-8")
            request.withCredentials = true;
            if (_method == "POST")
                request.setRequestHeader("Content-Type", "application/json");
            return request;
        }
    };
    RealmsClient.prototype.waitForRequestResponse = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        req.addEventListener("readystatechange", function () {
                            if (req.readyState == 4) {
                                if (req.status == 200) {
                                    resolve(req.responseText);
                                }
                                else if (req.status == 204) {
                                    resolve(true);
                                }
                                else {
                                    var re = { code: req.status, message: req.statusText };
                                    console.error(req.status, req.statusText);
                                    if (req.responseText != "")
                                        resolve(req.responseText);
                                    else
                                        resolve(JSON.stringify(re));
                                }
                            }
                        });
                    })];
            });
        });
    };
    //#region CORE requests
    //#region GET requests
    RealmsClient.prototype.compatible = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/mco/client/compatible")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.worlds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.world = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.ip = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/v1/" + _worldId + "/join/pc")];
                    case 1:
                        result = _a.sent();
                        if (result == "Retry again later")
                            return [2 /*return*/, result];
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.backups = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId + "/backups")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.downloadLatestBackup = function (_worldId, _slot) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId + "/slot/" + _slot + "/download")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.getOps = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/ops/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.subscriptions = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/subscriptions/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.inviteCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/invites/count/pending")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.invites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/invites/pending")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.templates = function (_type, _page, _pageSize) {
        if (_pageSize === void 0) { _pageSize = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/templates/" + _type + "?page=" + _page + "&pageSize=" + _pageSize)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    //#endregion
    //#region POST requests
    RealmsClient.prototype.makeOP = function (_worldId, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/ops/" + _worldId + "/" + _playerUUID, undefined)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.invitePlayer = function (_worldId, _playerName, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {};
                        if (_playerName)
                            data.name = _playerName;
                        else
                            data.uuid = _playerUUID;
                        return [4 /*yield*/, this.sendPostRequest("/invites/" + _worldId, data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.resetWorld = function (_worldId, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/worlds/" + _worldId + "/reset", _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.resetWorldToSeed = function (_worldId, _seed, _levelType, _generateStructures) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resetWorld(_worldId, { generateStructures: _generateStructures, levelType: _levelType, seed: _seed, worldTemplateId: -1 })];
            });
        });
    };
    RealmsClient.prototype.resetWorldToTemplate = function (_worldId, _templateId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resetWorld(_worldId, { generateStructures: false, levelType: -1, seed: "", worldTemplateId: _templateId })];
            });
        });
    };
    RealmsClient.prototype.setWorldSettings = function (_worldId, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/worlds/" + _worldId, _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.setSlotSettings = function (_worldId, _slot, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/worlds/" + _worldId + "/slot/" + _slot, _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region PUT requests
    RealmsClient.prototype.acceptInvite = function (_invitationId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/invites/accept/" + _invitationId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.rejectInvite = function (_invitationId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/invites/reject/" + _invitationId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.openRealm = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/open")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.closeRealm = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/close")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.setToMinigame = function (_worldId, _minigameId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/minigames/" + _minigameId + "/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!result];
                }
            });
        });
    };
    RealmsClient.prototype.setToSlot = function (_worldId, _slot) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/slot/" + _slot)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Closes the world to allow you to upload a new world.
     */
    RealmsClient.prototype.uploadInfo = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/backups/upload")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region DELETE requests
    RealmsClient.prototype.kickPlayer = function (_worldId, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest("/invites/" + _worldId + "/invite/" + _playerUUID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.deopPlayer = function (_worldId, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest("/ops/" + _worldId + "/" + _playerUUID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    RealmsClient.prototype.leaveServer = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest("/invites/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#endregion
    //#region OTHER requests
    RealmsClient.prototype.getNews = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/mco/v1/news")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    /** No idea what this does. */
    RealmsClient.prototype.regionPingResult = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/regions/ping/stat")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.getLiveStats = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/activities/liveplayerlist")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    // public async initialize(_worldId: number, _settings: RealmSettings): Promise<any> {
    // 	let result = await this.sendPostRequest("/worlds/" + _worldId + "/initialize");
    // 	return result;
    // }
    RealmsClient.prototype.mcoAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/mco/available")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.stageAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/mco/stageAvailable")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // public async restoreWorld(_worldId: number): Promise<any> {
    // 	let result = await this.sendPutRequest("/worlds/" + _worldId + "/backups");
    // 	return result;
    // }
    RealmsClient.prototype.agreeToTos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/mco/tos/agreed")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClient.prototype.trialAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/trial")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /** Doesn't seem to be doing anything. */
    RealmsClient.prototype.deleteWorld = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest("/worlds/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return RealmsClient;
}());
exports.default = RealmsClient;
