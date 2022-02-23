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
exports.AuthenticationHandler = void 0;
//@ts-expect-error
var xmlhttprequest_1 = require("xmlhttprequest");
var RelyingParty;
(function (RelyingParty) {
    RelyingParty["xbox"] = "http://xboxlive.com";
    RelyingParty["java"] = "rp://api.minecraftservices.com/";
    RelyingParty["bedrock"] = "https://pocket.realms.minecraft.net/";
})(RelyingParty || (RelyingParty = {}));
var AuthenticationHandler = /** @class */ (function () {
    function AuthenticationHandler(clientID, clientSecret, redirectUri) {
        if (!clientID)
            throw new Error("clientID is required");
        this.clientId = clientID;
        if (!clientSecret)
            throw new Error("clientSecret is required");
        this.clientSecret = clientSecret;
        if (!redirectUri)
            throw new Error("redirectUri is required");
        this.redirectUri = redirectUri;
    }
    Object.defineProperty(AuthenticationHandler.prototype, "forwardUrl", {
        get: function () {
            var url = "https://login.live.com/oauth20_authorize.srf?client_id=" + this.clientId + "&response_type=code&redirect_uri=" + this.redirectUri + "&scope=XboxLive.signin%20offline_access";
            return url;
        },
        enumerable: false,
        configurable: true
    });
    AuthenticationHandler.prototype.getAuthCodes = function (code, refresh) {
        if (refresh === void 0) { refresh = false; }
        return __awaiter(this, void 0, void 0, function () {
            var authToken, xbl, xstsJava, mcToken, mcInfo, xstsBR, xstsXBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!code)
                            throw Error("No Code provided.");
                        return [4 /*yield*/, this.authCodeToAuthToken(code, refresh).catch(function (reason) { throw Error("Code is invalid."); })];
                    case 1:
                        authToken = _a.sent();
                        return [4 /*yield*/, this.authTokenToXBL(authToken).catch(function (reason) { throw Error("Error during XBL Auth."); })];
                    case 2:
                        xbl = _a.sent();
                        return [4 /*yield*/, this.xblToXsts(xbl, RelyingParty.java).catch(function (reason) { throw Error("Error during XSTS (Java) Auth."); })];
                    case 3:
                        xstsJava = _a.sent();
                        return [4 /*yield*/, this.xstsToMc(xstsJava).catch(function (reason) { throw Error("Error during Mojang Auth."); })];
                    case 4:
                        mcToken = _a.sent();
                        return [4 /*yield*/, this.getMCInfo(mcToken).catch(function (reason) { throw Error("Error during Minecraft Info Fetch. Does the user own Minecraft?"); })];
                    case 5:
                        mcInfo = _a.sent();
                        return [4 /*yield*/, this.xblToXsts(xbl, RelyingParty.bedrock).catch(function (reason) { throw Error("Error during XSTS (Bedrock) Auth."); })];
                    case 6:
                        xstsBR = _a.sent();
                        return [4 /*yield*/, this.xblToXsts(xbl, RelyingParty.xbox).catch(function (reason) { throw Error("Error during XSTS (Xbox) Auth."); })];
                    case 7:
                        xstsXBox = _a.sent();
                        return [2 /*return*/, {
                                aquired: Date.now(),
                                auth_token: authToken,
                                mc_info: mcInfo,
                                mc_token: mcToken,
                                xbox_token: xbl,
                                xsts_tokens: {
                                    java: xstsJava,
                                    bedrock: xstsBR,
                                    xbox: xstsXBox,
                                },
                            }];
                }
            });
        });
    };
    AuthenticationHandler.prototype.refreshTokenIfNeeded = function (token) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var refreshNeeded, now, aqDate, authDate, _b, xboxDate, _c, _loop_1, this_1, _d, _e, _i, xsts, mcDate, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        refreshNeeded = false;
                        now = new Date(Date.now());
                        aqDate = new Date((_a = token.aquired) !== null && _a !== void 0 ? _a : 0);
                        authDate = new Date(aqDate.valueOf() + 1000 * token.auth_token.expires_in);
                        if (!(now > authDate)) return [3 /*break*/, 2];
                        _b = token;
                        return [4 /*yield*/, this.authCodeToAuthToken(token.auth_token.refresh_token, true).catch(function (reason) { throw Error("Couldn't refresh Auth Token."); })];
                    case 1:
                        _b.auth_token = _g.sent();
                        token.aquired = now.valueOf();
                        refreshNeeded = true;
                        _g.label = 2;
                    case 2:
                        xboxDate = new Date(token.xbox_token.NotAfter);
                        if (!(now > xboxDate || refreshNeeded)) return [3 /*break*/, 4];
                        _c = token;
                        return [4 /*yield*/, this.authTokenToXBL(token.auth_token).catch(function (reason) { throw Error("Error during XBL refresh."); })];
                    case 3:
                        _c.xbox_token = _g.sent();
                        refreshNeeded = true;
                        _g.label = 4;
                    case 4:
                        _loop_1 = function (xsts) {
                            var xstsToken, xstsDate;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        xstsToken = token.xsts_tokens[xsts];
                                        xstsDate = new Date(xstsToken.NotAfter);
                                        if (!(now > xstsDate || refreshNeeded)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1.xblToXsts(token.xbox_token, RelyingParty[xsts]).catch(function (reason) { throw Error("Error during XSTS (" + xsts + ") refresh."); })];
                                    case 1:
                                        //@ts-expect-error
                                        xstsToken = _h.sent();
                                        refreshNeeded = true;
                                        _h.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _d = [];
                        for (_e in token.xsts_tokens)
                            _d.push(_e);
                        _i = 0;
                        _g.label = 5;
                    case 5:
                        if (!(_i < _d.length)) return [3 /*break*/, 8];
                        xsts = _d[_i];
                        return [5 /*yield**/, _loop_1(xsts)];
                    case 6:
                        _g.sent();
                        _g.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        mcDate = new Date(token.mc_token.expires_in * 1000 + aqDate.valueOf());
                        if (!(now > mcDate || refreshNeeded)) return [3 /*break*/, 10];
                        _f = token;
                        return [4 /*yield*/, this.xstsToMc(token.xsts_tokens.java).catch(function (reason) { throw Error("Error during MC Token refresh."); })];
                    case 9:
                        _f.mc_token = _g.sent();
                        refreshNeeded = true;
                        _g.label = 10;
                    case 10: return [2 /*return*/, token];
                }
            });
        });
    };
    AuthenticationHandler.prototype.authCodeToAuthToken = function (code, refresh) {
        return __awaiter(this, void 0, void 0, function () {
            var request, data, promise;
            return __generator(this, function (_a) {
                request = new xmlhttprequest_1.XMLHttpRequest();
                data = "client_id=" + this.clientId +
                    "&client_secret=" + this.clientSecret +
                    "&redirect_uri=" + this.redirectUri;
                if (refresh) {
                    data += "&refresh_token=" + code +
                        "&grant_type=refresh_token";
                }
                else {
                    data += "&code=" + code +
                        "&grant_type=authorization_code";
                }
                request.open("POST", "https://login.live.com/oauth20_token.srf");
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                promise = this.waitForRequestText(request);
                request.send(data);
                return [2 /*return*/, promise];
            });
        });
    };
    AuthenticationHandler.prototype.authTokenToXBL = function (authToken) {
        return __awaiter(this, void 0, void 0, function () {
            var request, data, promise;
            return __generator(this, function (_a) {
                request = new xmlhttprequest_1.XMLHttpRequest();
                data = "{\n\t\t\t\"Properties\": {\n\t\t\t\t\"AuthMethod\": \"RPS\",\n\t\t\t\t\"SiteName\": \"user.auth.xboxlive.com\",\n\t\t\t\t\"RpsTicket\": \"d=" + authToken.access_token + "\"\n\t\t\t},\n\t\t\t\"RelyingParty\": \"http://auth.xboxlive.com\",\n\t\t\t\"TokenType\": \"JWT\"\n \t\t}";
                request.open("POST", "https://user.auth.xboxlive.com/user/authenticate");
                request.setRequestHeader("Content-Type", "application/json");
                request.setRequestHeader("Accept", "application/json");
                promise = this.waitForRequestText(request);
                request.send(data);
                return [2 /*return*/, promise];
            });
        });
    };
    AuthenticationHandler.prototype.xblToXsts = function (token, relyingParty) {
        return __awaiter(this, void 0, void 0, function () {
            var request, data, promise;
            return __generator(this, function (_a) {
                request = new xmlhttprequest_1.XMLHttpRequest();
                data = "{\n\t\t\t\"Properties\": {\n\t\t\t\t\"SandboxId\": \"RETAIL\",\n\t\t\t\t\"UserTokens\": [\n\t\t\t\t\t\t\"" + token.Token + "\"\n\t\t\t\t]\n\t\t\t},\n\t\t\t\"RelyingParty\": \"" + relyingParty + "\",\n\t\t\t\"TokenType\": \"JWT\"\n\t\t}";
                request.open("POST", "https://xsts.auth.xboxlive.com/xsts/authorize");
                request.setRequestHeader("Content-Type", "application/json");
                request.setRequestHeader("Accept", "application/json");
                promise = this.waitForRequestText(request);
                request.send(data);
                return [2 /*return*/, promise];
            });
        });
    };
    AuthenticationHandler.prototype.xstsToMc = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var request, data, promise;
            return __generator(this, function (_a) {
                request = new xmlhttprequest_1.XMLHttpRequest();
                data = "{\n\t\t\t\"identityToken\": \"XBL3.0 x=" + token.DisplayClaims.xui[0].uhs + ";" + token.Token + "\"\n\t \t\t}";
                request.open("POST", "https://api.minecraftservices.com/authentication/login_with_xbox");
                request.setRequestHeader("Content-Type", "application/json");
                request.setRequestHeader("Accept", "application/json");
                promise = this.waitForRequestText(request);
                request.send(data);
                return [2 /*return*/, promise];
            });
        });
    };
    AuthenticationHandler.prototype.getMCInfo = function (mc_token) {
        return __awaiter(this, void 0, void 0, function () {
            var request, promise;
            return __generator(this, function (_a) {
                request = new xmlhttprequest_1.XMLHttpRequest();
                request.open("GET", "https://api.minecraftservices.com/minecraft/profile");
                request.setRequestHeader("Authorization", "Bearer " + mc_token.access_token);
                promise = this.waitForRequestText(request);
                request.send();
                return [2 /*return*/, promise];
            });
        });
    };
    AuthenticationHandler.prototype.waitForRequestText = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        req.addEventListener("readystatechange", function () {
                            if (req.readyState == 4) {
                                if (req.status == 200) {
                                    resolve(JSON.parse(req.responseText));
                                }
                                else {
                                    console.error(req.status, req.statusText);
                                    reject(req.status);
                                }
                            }
                        });
                    })];
            });
        });
    };
    return AuthenticationHandler;
}());
exports.AuthenticationHandler = AuthenticationHandler;
