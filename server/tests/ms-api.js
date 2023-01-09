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
// @ts-expect-error
var xmlhttprequest_1 = require("xmlhttprequest");
var app = (0, express_1.default)();
// const clientId = "cf8b68fc-eb1a-442f-ae01-5fa94adce065";
// const clientSecret = "Kn7e34~A0-_Yu__u8KTn295OtC5vZW30-E";
var clientId = "6f26d7ba-f750-4876-a812-a8efcd652e8e";
var clientSecret = "L597Q~dzRru3whr-hqVzg4YvmSwiY8rqoKw0l";
var redirectUri = "http://localhost:3000/redirect";
var ah = new ms_api_1.AuthenticationHandler(clientId, clientSecret, redirectUri);
app.get("/", function (req, res) {
    res.redirect(ah.forwardUrl);
});
app.get("/redirect", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, result, request, responsePromise, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.query.code;
                if (!code) {
                    res.send("Error, code could not be retrieved.");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ah.getAuthCodes(code)];
            case 1:
                result = _a.sent();
                res.json(result);
                console.log("done");
                request = new xmlhttprequest_1.XMLHttpRequest();
                request.open("GET", "https://pocket.realms.minecraft.net/worlds");
                request.setRequestHeader("Authorization", "XBL3.0 x=" + result.xsts_tokens.bedrock.DisplayClaims.xui[0].uhs + ";" + result.xsts_tokens.bedrock.Token);
                request.setRequestHeader("Client-Version", "1.18.120");
                request.setRequestHeader("User-Agent", "MCPE/UWP");
                responsePromise = waitForRequestResponse(request);
                request.send();
                return [4 /*yield*/, responsePromise];
            case 2:
                response = _a.sent();
                console.log(response);
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000);
function waitForRequestResponse(req) {
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
}
