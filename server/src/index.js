"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authHandler = exports.latestVersion = exports.clients = exports.tokens = exports.tokenTimestamps = exports.db = exports.config = void 0;
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var config_1 = require("./config");
var ms_api_1 = require("../../ms-api");
var db_1 = require("./db");
var https = __importStar(require("https"));
var hat_1 = __importDefault(require("hat"));
var cors_1 = __importDefault(require("cors"));
var promises_1 = require("fs/promises");
var shared_1 = require("./shared");
var java_1 = require("./java");
if (process.argv[2] == "--local") {
    exports.config = config_1.configTesting;
}
else {
    exports.config = config_1.configProduction;
}
exports.db = new db_1.DB();
exports.tokenTimestamps = new Map();
exports.tokens = new Map();
exports.clients = new Map();
var app = (0, express_1.default)();
app.use(bodyParser.json());
// app.use((req, res, next)=>{
// 	let origin: string = (req.headers.origin == "http://localhost:8080") ? "http://localhost:8080" : "https://realmshub.com";
// 	res.set("Access-Control-Allow-Origin", origin);
// 	res.set("Access-Control-Allow-Methods","GET, POST");
// 	res.set("Access-Control-Allow-Headers","X-Requested-With,Content-Type");
// 	return next();
// })
// const corsOptions = {
// 	origin: "*",
// 	methods: "GET,POST",
// 	preflightContinue: false
// }
app.use((0, cors_1.default)({ methods: ["GET", "POST", "SEARCH"] }));
exports.authHandler = new ms_api_1.AuthenticationHandler(exports.config.clientId, exports.config.clientSecret, exports.config.redirectUri);
function logoutEverywhere(_id) {
    exports.tokens.delete(_id);
    exports.tokenTimestamps.delete(_id);
    exports.clients.delete(_id);
    exports.db.removeToken(_id);
}
//#region login/out
app.route("/login")
    .get(function (req, res) {
    res.send(exports.authHandler.forwardUrl);
})
    .post(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var code, authInfo, id, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.body.code;
                if (!code || typeof code != "string") {
                    res.sendStatus(400);
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.authHandler.getAuthCodes(code)];
            case 2:
                authInfo = _a.sent();
                id = (0, hat_1.default)(512, 32) + "." + (0, hat_1.default)(512, 32);
                (0, shared_1.initAuth)(id, authInfo);
                res.send({ id: id, username: authInfo.mc_info.name });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                (0, shared_1.anErrorOccured)(error_1, res);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .all(shared_1.wrongMethod);
app.route("/logout")
    .post(function (req, res) {
    var id = req.body.id;
    if (!id || typeof id != "string") {
        res.sendStatus(400);
        return;
    }
    logoutEverywhere(id);
    res.sendStatus(200);
})
    .all(shared_1.wrongMethod);
app.route("/check-login")
    .post(shared_1.checkAndInitAuth, function (req, res) {
    res.sendStatus(200);
})
    .all(shared_1.wrongMethod);
//#endregion
app.route("/announcement")
    .get(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).send;
                return [4 /*yield*/, getAnnouncement()];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); })
    .all(shared_1.wrongMethod);
(0, java_1.registerJavaPaths)(app);
// Catch-all
app.all("*", function (req, res) {
    res.sendStatus(404);
});
start();
function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getLatestVersion()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, exports.db.connect()];
                case 2:
                    _a.sent();
                    app.listen(9001);
                    console.log("Listening on Port 9001 and ready to go!");
                    return [2 /*return*/];
            }
        });
    });
}
function getLatestVersion() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    https.get("https://launchermeta.mojang.com/mc/game/version_manifest.json", function (res) {
                        var data = "";
                        res.on("data", function (d) {
                            data += d;
                        });
                        res.on("end", function () {
                            var _a;
                            var parsed = JSON.parse(data);
                            var version = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.latest) === null || _a === void 0 ? void 0 : _a.release;
                            exports.latestVersion = version || exports.latestVersion;
                            resolve(exports.latestVersion);
                        });
                    });
                })];
        });
    });
}
function getAnnouncement() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)(__dirname + "/../../announcement.html", "utf-8")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
