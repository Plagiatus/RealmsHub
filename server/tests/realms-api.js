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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ms_api_1 = require("../../ms-api");
var realms_api_1 = __importDefault(require("../../realms-api"));
var app = (0, express_1.default)();
var clientId = "cf8b68fc-eb1a-442f-ae01-5fa94adce065";
var clientSecret = "Kn7e34~A0-_Yu__u8KTn295OtC5vZW30-E";
var redirectUri = "http://localhost:3000/login-redirect";
var ah = new ms_api_1.AuthenticationHandler(clientId, clientSecret, redirectUri);
app.get("/", function (req, res) {
    res.redirect(ah.forwardUrl);
});
app.get("/login-redirect", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, result, worldId, token, uuid, name, realmsClient, _a, _b, _c, invCount, invs, accepted;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                code = req.query.code;
                if (!code) {
                    res.send("Error, code could not be retrieved.");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ah.getAuthCodes(code)];
            case 1:
                result = _d.sent();
                res.json(result);
                worldId = 4156375;
                token = result.mc_token.access_token;
                uuid = result.mc_info.id;
                name = result.mc_info.name;
                realmsClient = new realms_api_1.default("1.17.1", token, uuid, name);
                //#region  GET
                _b = (_a = console).log;
                _c = ["compatible"];
                return [4 /*yield*/, realmsClient.compatible()];
            case 2:
                //#region  GET
                _b.apply(_a, _c.concat([_d.sent()]));
                return [4 /*yield*/, realmsClient.inviteCount()];
            case 3:
                invCount = _d.sent();
                return [4 /*yield*/, realmsClient.invites()];
            case 4:
                invs = _d.sent();
                if (!(invCount > 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, realmsClient.acceptInvite(invs.invites[0].invitationId)];
            case 5:
                accepted = _d.sent();
                console.log("accepted", accepted);
                _d.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
app.listen(3000);
function fixedTest() {
    return __awaiter(this, void 0, void 0, function () {
        var token, uuid, name, worldId, realmsClient, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    token = "eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQwODU1MjA4MTAwNyIsInN1YiI6IjJiOTRjNmQ5LWY5MjktNGZmNy05ODFlLTQyNzhlYTMyZjk0NCIsIm5iZiI6MTYzMjQ4MzE1OSwiYXV0aCI6IlhCT1giLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwiZXhwIjoxNjMyNTY5NTU5LCJpYXQiOjE2MzI0ODMxNTksInBsYXRmb3JtIjoiVU5LTk9XTiIsInl1aWQiOiJlOWM3YjlmYzNjNTU0MTg5ODlhZDZiZjcxNmVmNTk0YSJ9.BqwUDZdBkU8cleFU3z1MRoPe2ripHfZI_UK3EJPRFoc";
                    uuid = "e75e2d263b724a93a3e7a2491f4c454f";
                    name = "Plagiatus";
                    worldId = 4156375;
                    realmsClient = new realms_api_1.default("1.17.1", token, uuid, name);
                    _b = (_a = console).log;
                    _c = ["news"];
                    return [4 /*yield*/, realmsClient.getNews()];
                case 1:
                    _b.apply(_a, _c.concat([_x.sent()]));
                    _e = (_d = console).log;
                    _f = ["pingresult"];
                    return [4 /*yield*/, realmsClient.regionPingResult()];
                case 2:
                    _e.apply(_d, _f.concat([_x.sent()]));
                    _h = (_g = console).log;
                    _j = ["livestats"];
                    return [4 /*yield*/, realmsClient.getLiveStats(worldId)];
                case 3:
                    _h.apply(_g, _j.concat([_x.sent()]));
                    // console.log("init", await realmsClient.initialize(worldId, {description: "Desc", name: "Name"}));
                    _l = (_k = console).log;
                    _m = ["mco"];
                    return [4 /*yield*/, realmsClient.mcoAvailable()];
                case 4:
                    // console.log("init", await realmsClient.initialize(worldId, {description: "Desc", name: "Name"}));
                    _l.apply(_k, _m.concat([_x.sent()]));
                    _p = (_o = console).log;
                    _q = ["stage"];
                    return [4 /*yield*/, realmsClient.stageAvailable()];
                case 5:
                    _p.apply(_o, _q.concat([_x.sent()]));
                    // console.log("restore", await realmsClient.restoreWorld(worldId));
                    _s = (_r = console).log;
                    _t = ["trial"];
                    return [4 /*yield*/, realmsClient.trialAvailable()];
                case 6:
                    // console.log("restore", await realmsClient.restoreWorld(worldId));
                    _s.apply(_r, _t.concat([_x.sent()]));
                    _v = (_u = console).log;
                    _w = ["delete"];
                    return [4 /*yield*/, realmsClient.deleteWorld(worldId)];
                case 7:
                    _v.apply(_u, _w.concat([_x.sent()]));
                    return [2 /*return*/];
            }
        });
    });
}
fixedTest();
