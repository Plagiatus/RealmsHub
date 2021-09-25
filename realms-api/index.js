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
var JavaRealmsApiClient = /** @class */ (function () {
    function JavaRealmsApiClient(_gameVersion, _accessToken, _uuid, _name) {
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
    Object.defineProperty(JavaRealmsApiClient.prototype, "cookie", {
        get: function () {
            return "sid=token:" + this.accessToken + ":" + this.playerUuid + ";user=" + this.playerName + ";version=" + JavaRealmsApiClient.gameVersion;
        },
        enumerable: true,
        configurable: true
    });
    JavaRealmsApiClient.prototype.sendGetRequest = function (_url) {
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
    JavaRealmsApiClient.prototype.sendPostRequest = function (_url, _data) {
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
    JavaRealmsApiClient.prototype.sendPutRequest = function (_url) {
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
    JavaRealmsApiClient.prototype.sendDeleteRequest = function (_url) {
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
    JavaRealmsApiClient.prototype.createRequest = function (_url, _method) {
        var request = new xmlhttprequest_1.XMLHttpRequest();
        request.open(_method, _url);
        request.setDisableHeaderCheck(true);
        request.setRequestHeader("Cookie", this.cookie);
        if (_method == "POST")
            request.setRequestHeader("Content-Type", "application/json");
        return request;
    };
    JavaRealmsApiClient.prototype.waitForRequestResponse = function (req) {
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
    JavaRealmsApiClient.prototype.compatible = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/client/compatible")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.worlds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.world = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.ip = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/v1/" + _worldId + "/join/pc")];
                    case 1:
                        result = _a.sent();
                        if (result == "Retry again later")
                            return [2 /*return*/, result];
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.backups = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.downloadLatestBackup = function (_worldId, _slot) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot + "/download")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.getOps = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.subscriptions = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/subscriptions/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.inviteCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/invites/count/pending")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.invites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/invites/pending")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.templates = function (_type, _page, _pageSize) {
        if (_pageSize === void 0) { _pageSize = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/worlds/templates/" + _type + "?page=" + _page + "&pageSize=" + _pageSize)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    //#endregion
    //#region POST requests
    JavaRealmsApiClient.prototype.makeOP = function (_worldId, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId + "/" + _playerUUID, undefined)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.invitePlayer = function (_worldId, _playerName, _playerUUID) {
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
                        return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId, data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.resetWorld = function (_worldId, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/reset", _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.resetWorldToSeed = function (_worldId, _seed, _levelType, _generateStructures) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resetWorld(_worldId, { generateStructures: _generateStructures, levelType: _levelType, seed: _seed, worldTemplateId: -1 })];
            });
        });
    };
    JavaRealmsApiClient.prototype.resetWorldToTemplate = function (_worldId, _templateId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resetWorld(_worldId, { generateStructures: false, levelType: -1, seed: "", worldTemplateId: _templateId })];
            });
        });
    };
    JavaRealmsApiClient.prototype.setWorldSettings = function (_worldId, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId, _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.setSlotSettings = function (_worldId, _slot, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot, _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region PUT requests
    JavaRealmsApiClient.prototype.acceptInvite = function (_invitationId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/invites/accept/" + _invitationId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.rejectInvite = function (_invitationId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/invites/reject/" + _invitationId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.openRealm = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/open")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.closeRealm = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/close")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.setToMinigame = function (_worldId, _minigameId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/minigames/" + _minigameId + "/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.setToSlot = function (_worldId, _slot) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/slot/" + _slot)];
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
    JavaRealmsApiClient.prototype.uploadInfo = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups/upload")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region DELETE requests
    JavaRealmsApiClient.prototype.kickPlayer = function (_worldId, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId + "/invite/" + _playerUUID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.deopPlayer = function (_worldId, _playerUUID) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/ops/" + _worldId + "/" + _playerUUID)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.leaveServer = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/invites/" + _worldId)];
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
    JavaRealmsApiClient.prototype.getNews = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/v1/news")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    /** No idea what this does. */
    JavaRealmsApiClient.prototype.regionPingResult = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/regions/ping/stat")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.getLiveStats = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/activities/liveplayerlist")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, JSON.parse(result)];
                }
            });
        });
    };
    // public async initialize(_worldId: number, _settings: RealmSettings): Promise<any> {
    // 	let result = await this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/initialize");
    // 	return result;
    // }
    JavaRealmsApiClient.prototype.mcoAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/available")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.stageAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/mco/stageAvailable")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // public async restoreWorld(_worldId: number): Promise<any> {
    // 	let result = await this.sendPutRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId + "/backups");
    // 	return result;
    // }
    JavaRealmsApiClient.prototype.agreeToTos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest(JavaRealmsApiClient.apiUrl + "/mco/tos/agreed")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.prototype.trialAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest(JavaRealmsApiClient.apiUrl + "/trial")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /** Doesn't seem to be doing anything. */
    JavaRealmsApiClient.prototype.deleteWorld = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest(JavaRealmsApiClient.apiUrl + "/worlds/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    JavaRealmsApiClient.apiUrl = "https://pc.realms.minecraft.net";
    return JavaRealmsApiClient;
}());
exports.default = JavaRealmsApiClient;
