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
exports.registerBedrockPaths = void 0;
var _1 = require(".");
var shared_1 = require("./shared");
function registerBedrockPaths(app) {
    var _this = this;
    var prefix = "/br";
    app.route(prefix + "/invites/:command")
        .post(shared_1.checkAndInitAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var client, command, _a, _b, _c, _d, invID, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    client = _1.clients.get(req.body.id);
                    command = req.params.command;
                    if (!(command == "get")) return [3 /*break*/, 2];
                    _b = (_a = res).send;
                    return [4 /*yield*/, client.invites()];
                case 1:
                    _b.apply(_a, [_j.sent()]);
                    return [3 /*break*/, 8];
                case 2:
                    if (!(command == "count")) return [3 /*break*/, 4];
                    _d = (_c = res).send;
                    return [4 /*yield*/, client.inviteCount()];
                case 3:
                    _d.apply(_c, [_j.sent()]);
                    return [3 /*break*/, 8];
                case 4:
                    invID = req.body.invitationId;
                    if (!invID) {
                        res.send(400);
                        return [2 /*return*/];
                    }
                    if (!(command == "accept")) return [3 /*break*/, 6];
                    _f = (_e = res).send;
                    return [4 /*yield*/, client.acceptInvite(invID)];
                case 5:
                    _f.apply(_e, [_j.sent()]);
                    return [3 /*break*/, 8];
                case 6:
                    if (!(command == "reject")) return [3 /*break*/, 8];
                    _h = (_g = res).send;
                    return [4 /*yield*/, client.rejectInvite(invID)];
                case 7:
                    _h.apply(_g, [_j.sent()]);
                    _j.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); })
        .all(shared_1.wrongMethod);
    app.route(prefix + "/worlds/slot/:command")
        .post(shared_1.checkAndInitAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var worldId, slot, client, command, _a, settings, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    worldId = parseInt(req.body.worldId);
                    slot = parseInt(req.body.slot);
                    if (isNaN(worldId) || worldId < 0 || slot < 1 || slot > 3) {
                        res.sendStatus(400);
                        return [2 /*return*/];
                    }
                    client = _1.clients.get(req.body.id);
                    command = req.params.command;
                    _a = command;
                    switch (_a) {
                        case "settings": return [3 /*break*/, 1];
                        case "set": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    settings = req.body.settings;
                    if (!settings) {
                        res.sendStatus(400);
                        return [2 /*return*/];
                    }
                    _c = (_b = res).send;
                    return [4 /*yield*/, client.setSlotSettings(worldId, slot, settings)];
                case 2:
                    _c.apply(_b, [_f.sent()]);
                    return [3 /*break*/, 6];
                case 3:
                    _e = (_d = res).send;
                    return [4 /*yield*/, client.setToSlot(worldId, slot)];
                case 4:
                    _e.apply(_d, [_f.sent()]);
                    return [3 /*break*/, 6];
                case 5:
                    res.sendStatus(404);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); })
        .all(shared_1.wrongMethod);
    app.route(prefix + "/worlds/player/:command")
        .post(shared_1.checkAndInitAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var worldId, uuid, client, command, _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    worldId = parseInt(req.body.worldId);
                    uuid = req.body.uuid;
                    if (isNaN(worldId) || worldId < 0 || !uuid || uuid === "" || typeof uuid != "string") {
                        res.sendStatus(400);
                        return [2 /*return*/];
                    }
                    client = _1.clients.get(req.body.id);
                    command = req.params.command;
                    _a = command;
                    switch (_a) {
                        case "deop": return [3 /*break*/, 1];
                        case "op": return [3 /*break*/, 3];
                        case "invite": return [3 /*break*/, 5];
                        case "kick": return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 1:
                    _c = (_b = res).send;
                    return [4 /*yield*/, client.deopPlayer(worldId, uuid)];
                case 2:
                    _c.apply(_b, [_k.sent()]);
                    return [3 /*break*/, 10];
                case 3:
                    _e = (_d = res).send;
                    return [4 /*yield*/, client.makeOP(worldId, uuid)];
                case 4:
                    _e.apply(_d, [_k.sent()]);
                    return [3 /*break*/, 10];
                case 5:
                    _g = (_f = res).send;
                    return [4 /*yield*/, client.invitePlayer(worldId, req.body.name, uuid)];
                case 6:
                    _g.apply(_f, [_k.sent()]);
                    return [3 /*break*/, 10];
                case 7:
                    _j = (_h = res).send;
                    return [4 /*yield*/, client.kickPlayer(worldId, uuid)];
                case 8:
                    _j.apply(_h, [_k.sent()]);
                    return [3 /*break*/, 10];
                case 9:
                    res.sendStatus(404);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); })
        .all(shared_1.wrongMethod);
    app.route(prefix + "/worlds/:command")
        .post(shared_1.checkAndInitAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var worldId, client, command, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, seed, worldType, genStructures, _t, _u, template, _v, _w, minigame, _x, _y, slot, _z, _0, settings, _2, _3, _4, _5, _6, _7;
        return __generator(this, function (_8) {
            switch (_8.label) {
                case 0:
                    worldId = parseInt(req.body.worldId);
                    if (!worldId || isNaN(worldId)) {
                        res.sendStatus(400);
                        return [2 /*return*/];
                    }
                    client = _1.clients.get(req.body.id);
                    command = req.params.command;
                    _a = command;
                    switch (_a) {
                        case "get-one": return [3 /*break*/, 1];
                        case "backups": return [3 /*break*/, 3];
                        case "close": return [3 /*break*/, 5];
                        case "livestats": return [3 /*break*/, 7];
                        case "ops": return [3 /*break*/, 9];
                        case "ip": return [3 /*break*/, 11];
                        case "leave": return [3 /*break*/, 13];
                        case "open": return [3 /*break*/, 15];
                        case "reset": return [3 /*break*/, 17];
                        case "reset-template": return [3 /*break*/, 19];
                        case "minigame": return [3 /*break*/, 21];
                        case "slot": return [3 /*break*/, 23];
                        case "settings": return [3 /*break*/, 25];
                        case "subscriptions": return [3 /*break*/, 27];
                        case "uploadinfo": return [3 /*break*/, 29];
                    }
                    return [3 /*break*/, 31];
                case 1:
                    _c = (_b = res).send;
                    return [4 /*yield*/, client.world(worldId)];
                case 2:
                    _c.apply(_b, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 3:
                    _e = (_d = res).send;
                    return [4 /*yield*/, client.backups(worldId)];
                case 4:
                    _e.apply(_d, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 5:
                    _g = (_f = res).send;
                    return [4 /*yield*/, client.closeRealm(worldId)];
                case 6:
                    _g.apply(_f, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 7:
                    _j = (_h = res).send;
                    return [4 /*yield*/, client.getLiveStats(worldId)];
                case 8:
                    _j.apply(_h, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 9:
                    _l = (_k = res).send;
                    return [4 /*yield*/, client.getOps(worldId)];
                case 10:
                    _l.apply(_k, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 11:
                    _o = (_m = res).send;
                    return [4 /*yield*/, client.ip(worldId)];
                case 12:
                    _o.apply(_m, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 13:
                    _q = (_p = res).send;
                    return [4 /*yield*/, client.leaveServer(worldId)];
                case 14:
                    _q.apply(_p, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 15:
                    _s = (_r = res).send;
                    return [4 /*yield*/, client.openRealm(worldId)];
                case 16:
                    _s.apply(_r, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 17:
                    seed = req.body.seed;
                    worldType = req.body.worldType;
                    genStructures = !!req.body.generateStructures;
                    if (seed == undefined || worldType == undefined) {
                        res.sendStatus(400);
                        return [3 /*break*/, 32];
                    }
                    _u = (_t = res).send;
                    return [4 /*yield*/, client.resetWorldToSeed(worldId, seed, worldType, genStructures)];
                case 18:
                    _u.apply(_t, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 19:
                    template = parseInt(req.body.template);
                    if (isNaN(template) || template < 0) {
                        res.sendStatus(400);
                        return [3 /*break*/, 32];
                    }
                    _w = (_v = res).send;
                    return [4 /*yield*/, client.resetWorldToTemplate(worldId, template)];
                case 20:
                    _w.apply(_v, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 21:
                    minigame = parseInt(req.body.minigame);
                    if (isNaN(minigame) || minigame < 0) {
                        res.sendStatus(400);
                        return [3 /*break*/, 32];
                    }
                    _y = (_x = res).send;
                    return [4 /*yield*/, client.setToMinigame(worldId, minigame)];
                case 22:
                    _y.apply(_x, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 23:
                    slot = parseInt(req.body.slot);
                    if (isNaN(slot) || slot < 1 || slot > 3) {
                        res.sendStatus(400);
                        return [3 /*break*/, 32];
                    }
                    _0 = (_z = res).send;
                    return [4 /*yield*/, client.setToSlot(worldId, slot)];
                case 24:
                    _0.apply(_z, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 25:
                    settings = req.body.settings;
                    if (!settings.name || !settings.description) {
                        res.sendStatus(400);
                        return [3 /*break*/, 32];
                    }
                    _3 = (_2 = res).send;
                    return [4 /*yield*/, client.setWorldSettings(worldId, settings)];
                case 26:
                    _3.apply(_2, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 27:
                    _5 = (_4 = res).send;
                    return [4 /*yield*/, client.subscriptions(worldId)];
                case 28:
                    _5.apply(_4, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 29:
                    _7 = (_6 = res).send;
                    return [4 /*yield*/, client.uploadInfo(worldId)];
                case 30:
                    _7.apply(_6, [_8.sent()]);
                    return [3 /*break*/, 32];
                case 31:
                    res.sendStatus(404);
                    return [3 /*break*/, 32];
                case 32: return [2 /*return*/];
            }
        });
    }); })
        .all(shared_1.wrongMethod);
    app.route(prefix + "/:command")
        .post(shared_1.checkAndInitAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var command, client, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    command = req.params.command;
                    client = _1.clients.get(req.body.id);
                    _a = command;
                    switch (_a) {
                        case "worlds": return [3 /*break*/, 1];
                        case "tos": return [3 /*break*/, 3];
                        case "compatible": return [3 /*break*/, 5];
                        case "news": return [3 /*break*/, 7];
                        case "mco": return [3 /*break*/, 9];
                        case "regionping": return [3 /*break*/, 11];
                        case "stage": return [3 /*break*/, 13];
                        case "trial": return [3 /*break*/, 15];
                    }
                    return [3 /*break*/, 17];
                case 1:
                    _c = (_b = res).send;
                    return [4 /*yield*/, client.worlds()];
                case 2:
                    _c.apply(_b, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 3:
                    _e = (_d = res).send;
                    return [4 /*yield*/, client.agreeToTos()];
                case 4:
                    _e.apply(_d, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 5:
                    _g = (_f = res).send;
                    return [4 /*yield*/, client.compatible()];
                case 6:
                    _g.apply(_f, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 7:
                    _j = (_h = res).send;
                    return [4 /*yield*/, client.getNews()];
                case 8:
                    _j.apply(_h, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 9:
                    _l = (_k = res).send;
                    return [4 /*yield*/, client.mcoAvailable()];
                case 10:
                    _l.apply(_k, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 11:
                    _o = (_m = res).send;
                    return [4 /*yield*/, client.regionPingResult()];
                case 12:
                    _o.apply(_m, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 13:
                    _q = (_p = res).send;
                    return [4 /*yield*/, client.stageAvailable()];
                case 14:
                    _q.apply(_p, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 15:
                    _s = (_r = res).send;
                    return [4 /*yield*/, client.trialAvailable()];
                case 16:
                    _s.apply(_r, [_t.sent()]);
                    return [3 /*break*/, 18];
                case 17:
                    res.sendStatus(404);
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
            }
        });
    }); })
        .all(shared_1.wrongMethod);
}
exports.registerBedrockPaths = registerBedrockPaths;
var templateMap = new Map();
var lastTemplateCheck = 0;
function getTemplates(type, page, size, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var templates, hoursSinceLastCheck, result, types, client, _i, types_1, type_1, oneTemp, allTemps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templates = templateMap.get(type);
                    hoursSinceLastCheck = (Date.now() - lastTemplateCheck) / 1000 / 60 / 60;
                    if (!(clientId && _1.clients.has(clientId) && hoursSinceLastCheck > 24)) { //if there is no client ID and the last check was less than 24 hours ago check if templates exist, otherwise reload templates
                        if (templates) {
                            result = {
                                page: page,
                                size: size,
                                total: templates.length,
                                templates: templates.slice((page) * size, (page + 1) * size)
                            };
                            return [2 /*return*/, result];
                        }
                    }
                    types = ["MINIGAME", "ADVENTUREMAP", "EXPERIENCE", "NORMAL", "INSPIRATION"];
                    if (!clientId || !_1.clients.has(clientId) || !types.includes(type)) {
                        return [2 /*return*/, { page: -1, size: -1, total: -1, templates: [] }];
                    }
                    client = _1.clients.get(clientId);
                    _i = 0, types_1 = types;
                    _a.label = 1;
                case 1:
                    if (!(_i < types_1.length)) return [3 /*break*/, 5];
                    type_1 = types_1[_i];
                    return [4 /*yield*/, client.templates(type_1, 0, 1)];
                case 2:
                    oneTemp = _a.sent();
                    return [4 /*yield*/, client.templates(type_1, 0, oneTemp.total)];
                case 3:
                    allTemps = _a.sent();
                    templateMap.set(type_1, allTemps.templates);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    lastTemplateCheck = Date.now();
                    return [2 /*return*/, getTemplates(type, page, size)];
            }
        });
    });
}