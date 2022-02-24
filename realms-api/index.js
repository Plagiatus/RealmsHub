"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.RealmsClientBedrock = exports.RealmsClientJava = void 0;
//@ts-expect-error
var xmlhttprequest_1 = require("xmlhttprequest");
var RealmsClient = /** @class */ (function () {
    function RealmsClient(_gameVersion) {
        this.gameVersion = _gameVersion;
    }
    RealmsClient.prototype.sendGetRequest = function (_path) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_path, "GET");
                promise = this.waitForRequestResponse(request);
                request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.sendPostRequest = function (_path, _data) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_path, "POST");
                promise = this.waitForRequestResponse(request);
                if (_data)
                    request.send(JSON.stringify(_data));
                else
                    request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.sendPutRequest = function (_path, _data) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_path, "PUT");
                promise = this.waitForRequestResponse(request);
                if (_data)
                    request.send(JSON.stringify(_data));
                else
                    request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    RealmsClient.prototype.sendDeleteRequest = function (_path) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = this.createRequest(_path, "DELETE");
                promise = this.waitForRequestResponse(request);
                request.send();
                return [2 /*return*/, promise];
            });
        });
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
    return RealmsClient;
}());
var RealmsClientJava = /** @class */ (function (_super) {
    __extends(RealmsClientJava, _super);
    function RealmsClientJava(_gameVersion, _accessToken, _uuid, _name, _pe) {
        if (_pe === void 0) { _pe = false; }
        var _this = _super.call(this, _gameVersion) || this;
        _this.accessToken = _accessToken;
        _this.playerUuid = _uuid;
        _this.playerName = _name;
        _this.pe = _pe;
        return _this;
    }
    Object.defineProperty(RealmsClientJava.prototype, "cookie", {
        get: function () {
            return "sid=token:" + this.accessToken + ":" + this.playerUuid + ";user=" + this.playerName + ";version=" + this.gameVersion;
        },
        enumerable: false,
        configurable: true
    });
    RealmsClientJava.prototype.createRequest = function (_path, _method) {
        var url = "https://pc.realms.minecraft.net" + _path;
        var request = new xmlhttprequest_1.XMLHttpRequest();
        request.open(_method, url);
        request.setDisableHeaderCheck(true);
        request.setRequestHeader("Cookie", this.cookie);
        if (_method == "POST")
            request.setRequestHeader("Content-Type", "application/json");
        return request;
    };
    //#region CORE requests
    //#region GET requests
    RealmsClientJava.prototype.compatible = function () {
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
    RealmsClientJava.prototype.worlds = function () {
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
    RealmsClientJava.prototype.world = function (_worldId) {
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
    RealmsClientJava.prototype.ip = function (_worldId) {
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
    RealmsClientJava.prototype.backups = function (_worldId) {
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
    RealmsClientJava.prototype.downloadLatestBackup = function (_worldId, _slot) {
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
    RealmsClientJava.prototype.getOps = function (_worldId) {
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
    RealmsClientJava.prototype.subscriptions = function (_worldId) {
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
    RealmsClientJava.prototype.inviteCount = function () {
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
    RealmsClientJava.prototype.invites = function () {
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
    RealmsClientJava.prototype.templates = function (_type, _page, _pageSize) {
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
    RealmsClientJava.prototype.makeOP = function (_worldId, _playerUUID) {
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
    RealmsClientJava.prototype.invitePlayer = function (_worldId, _playerName, _playerUUID) {
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
    RealmsClientJava.prototype.resetWorld = function (_worldId, _settings) {
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
    RealmsClientJava.prototype.resetWorldToSeed = function (_worldId, _seed, _levelType, _generateStructures) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resetWorld(_worldId, { generateStructures: _generateStructures, levelType: _levelType, seed: _seed, worldTemplateId: -1 })];
            });
        });
    };
    RealmsClientJava.prototype.resetWorldToTemplate = function (_worldId, _templateId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.resetWorld(_worldId, { generateStructures: false, levelType: -1, seed: "", worldTemplateId: _templateId })];
            });
        });
    };
    RealmsClientJava.prototype.setWorldSettings = function (_worldId, _settings) {
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
    RealmsClientJava.prototype.setSlotSettings = function (_worldId, _slot, _settings) {
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
    RealmsClientJava.prototype.acceptInvite = function (_invitationId) {
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
    RealmsClientJava.prototype.rejectInvite = function (_invitationId) {
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
    RealmsClientJava.prototype.openRealm = function (_worldId) {
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
    RealmsClientJava.prototype.closeRealm = function (_worldId) {
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
    RealmsClientJava.prototype.setToMinigame = function (_worldId, _minigameId) {
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
    RealmsClientJava.prototype.setToSlot = function (_worldId, _slot) {
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
    RealmsClientJava.prototype.uploadInfo = function (_worldId) {
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
    RealmsClientJava.prototype.kickPlayer = function (_worldId, _playerUUID) {
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
    RealmsClientJava.prototype.deopPlayer = function (_worldId, _playerUUID) {
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
    RealmsClientJava.prototype.leaveServer = function (_worldId) {
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
    RealmsClientJava.prototype.getNews = function () {
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
    RealmsClientJava.prototype.regionPingResult = function () {
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
    RealmsClientJava.prototype.getLiveStats = function (_worldId) {
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
    RealmsClientJava.prototype.mcoAvailable = function () {
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
    RealmsClientJava.prototype.stageAvailable = function () {
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
    RealmsClientJava.prototype.agreeToTos = function () {
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
    RealmsClientJava.prototype.trialAvailable = function () {
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
    RealmsClientJava.prototype.deleteWorld = function (_worldId) {
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
    return RealmsClientJava;
}(RealmsClient));
exports.RealmsClientJava = RealmsClientJava;
var RealmsClientBedrock = /** @class */ (function (_super) {
    __extends(RealmsClientBedrock, _super);
    function RealmsClientBedrock(_gameVersion, _xstsBr, _xstsXbox) {
        var _this = _super.call(this, _gameVersion) || this;
        _this.xstsBedrock = { token: _xstsBr.Token, userhash: _xstsBr.DisplayClaims.xui[0].uhs };
        _this.xstsXbox = { token: _xstsXbox.Token, userhash: _xstsXbox.DisplayClaims.xui[0].uhs };
        return _this;
    }
    RealmsClientBedrock.prototype.accessToken = function (xsts) {
        if (xsts === void 0) { xsts = this.xstsBedrock; }
        return "XBL3.0 x=" + xsts.userhash + ";" + xsts.token;
    };
    RealmsClientBedrock.prototype.createRequest = function (_url, _method, _xsts) {
        if (_xsts === void 0) { _xsts = this.xstsBedrock; }
        var url = "https://pocket.realms.minecraft.net" + _url;
        var request = new xmlhttprequest_1.XMLHttpRequest();
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
    };
    RealmsClientBedrock.prototype.getPlayerInformation = function () {
        var xuids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            xuids[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var url, request;
            return __generator(this, function (_a) {
                if (xuids.length == 0)
                    return [2 /*return*/, []];
                url = "https://peoplehub.xboxlive.com/users/me/people/xuids(" + xuids.toString() + ")";
                request = new xmlhttprequest_1.XMLHttpRequest();
                request.open("GET", url);
                request.setRequestHeader("Authorization", this.accessToken(this.xstsXbox));
                request.setRequestHeader("x-xbl-contract-version", 4);
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("Accept-Language", "en_us");
                return [2 /*return*/, this.waitForRequestResponse(request)];
            });
        });
    };
    //#region CORE requests
    //#region GET requests
    RealmsClientBedrock.prototype.compatible = function () {
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
    RealmsClientBedrock.prototype.worlds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.world = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.ip = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/server/" + _worldId + "/join")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.backups = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId + "/backups")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.downloadBackup = function (_worldId, _backupId, _slot) {
        if (_backupId === void 0) { _backupId = "latest"; }
        if (_slot === void 0) { _slot = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/archive/download/world/" + _worldId + "/" + _slot + "/" + _backupId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.inviteLinks = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/links/v1?worldId=" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.infoAboutInviteCode = function (_code) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/v1/link/" + _code)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.blockedPlayers = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId + "/blocklist")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.subscriptions = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/worlds/" + _worldId + "/blocklist")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.inviteCount = function () {
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
    RealmsClientBedrock.prototype.invites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/invites/")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region POST requests
    RealmsClientBedrock.prototype.joinRealmThroughCode = function (_code) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/invites/v1/link/accept/" + _code)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.applyContent = function (_worldId, _packUUIDs) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/world/" + _worldId + "/content/", _packUUIDs)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.setWorldSettings = function (_worldId, _settings) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/world/" + _worldId + "/configuration/", _settings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.blockUser = function (_worldId, _xuid) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/world/" + _worldId + "/blocklist/" + _xuid)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region PUT requests
    RealmsClientBedrock.prototype.kickPlayers = function (_worldId, _xuids) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, _xuids_1, xuid, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = { invites: {} };
                        for (_i = 0, _xuids_1 = _xuids; _i < _xuids_1.length; _i++) {
                            xuid = _xuids_1[_i];
                            data.invites[xuid] = "REMOVE";
                        }
                        return [4 /*yield*/, this.sendPutRequest("/invites/" + _worldId + "/invite/update", data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.invitePlayers = function (_worldId, _xuids) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, _xuids_2, xuid, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = { invites: {} };
                        for (_i = 0, _xuids_2 = _xuids; _i < _xuids_2.length; _i++) {
                            xuid = _xuids_2[_i];
                            data.invites[xuid] = "ADD";
                        }
                        return [4 /*yield*/, this.sendPutRequest("/invites/" + _worldId + "/invite/update", data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.defaultPermission = function (_worldId, _permission) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/defaultPermission", { permission: _permission })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.changeUserPermission = function (_worldId, _xuid, _permission) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/userPermission", { permission: _permission, xuid: _xuid })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.setToSlot = function (_worldId, _slot) {
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
    RealmsClientBedrock.prototype.openRealm = function (_worldId) {
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
    RealmsClientBedrock.prototype.closeRealm = function (_worldId) {
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
    RealmsClientBedrock.prototype.resetRealm = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/worlds/" + _worldId + "/reset")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.forceResourcepackOnJoin = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/world/" + _worldId + "/content/texturePacksRequired")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.acceptInvite = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPutRequest("/invites/accept/" + _worldId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region DELETE requests
    RealmsClientBedrock.prototype.unblockUser = function (_worldId, _xuid) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest("/worlds/" + _worldId + "/blocklist/" + _xuid)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.rejectInvite = function (_worldId) {
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
    RealmsClientBedrock.prototype.leaveServer = function (_worldId) {
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
    RealmsClientBedrock.prototype.dontForceResourcepackOnJoin = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendDeleteRequest("/world/" + _worldId + "/content/texturePacksRequired")];
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
    //#region GET requests
    RealmsClientBedrock.prototype.trial = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/trial/new")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.livePlayers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendGetRequest("/activities/live/players")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //#endregion
    //#region POST requests
    RealmsClientBedrock.prototype.validateClubs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/clubs/validate")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.clearMembers = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/invites/" + _worldId + "/invite/update", { invites: null })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.initializeDEV = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/worlds/" + _worldId + "/initialize", { invites: null })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RealmsClientBedrock.prototype.editConfigDEV = function (_worldId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/worlds/" + _worldId + "/configuration/dev", { invites: null })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return RealmsClientBedrock;
}(RealmsClient));
exports.RealmsClientBedrock = RealmsClientBedrock;
