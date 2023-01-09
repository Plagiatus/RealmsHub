//@ts-expect-error
import { XMLHttpRequest } from "xmlhttprequest";

interface AuthorizationTokenResponse {
	token_type: string,
	expires_in: number,
	scope: string,
	access_token: string,
	refresh_token: string,
	user_id: string,
	foci: string
}

export interface XboxServiceTokenResponse {
	IssueInstant: string,
	NotAfter: string,
	Token: string,
	DisplayClaims: DisplayClaim;
}

interface MCTokenResponse {
	username: string,
	roles: any[],
	access_token: string,
	token_type: string,
	expires_in: number
}

interface MCUserInfo {
	id: string,
	name: string,
	skins: MCSkinInfo[],
	capes: MCCapeInfo[]
}

interface MCInfo {
	id: string,
	state: "ACTIVE" | "INACTIVE",
	url: string,
}
interface MCSkinInfo extends MCInfo {
	variant: string,
}
interface MCCapeInfo extends MCInfo {
	alias: string,
}

export interface AuthInfo {
	aquired: number,
	auth_token: AuthorizationTokenResponse,
	xbox_token: XboxServiceTokenResponse,
	xsts_tokens: {
		bedrock: XboxServiceTokenResponse,
		java: XboxServiceTokenResponse,
		xbox: XboxServiceTokenResponse,
	}
	mc_token: MCTokenResponse,
	mc_info: MCUserInfo,
}

interface DisplayClaim {
	xui: {
		uhs: string;
	}[]
}

enum RelyingParty {
	xbox = "http://xboxlive.com",
	java = "rp://api.minecraftservices.com/",
	bedrock = "https://pocket.realms.minecraft.net/",
}

export class AuthenticationHandler {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;

	constructor(clientID: string, clientSecret: string, redirectUri: string) {
		if (!clientID) throw new Error("clientID is required");
		this.clientId = clientID;
		if (!clientSecret) throw new Error("clientSecret is required");
		this.clientSecret = clientSecret;
		if (!redirectUri) throw new Error("redirectUri is required");
		this.redirectUri = redirectUri;
	}


	public get forwardUrl(): string {
		let url: string = `https://login.live.com/oauth20_authorize.srf?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=XboxLive.signin%20offline_access`;
		return url;
	}

	public async getAuthCodes(code: string, refresh: boolean = false): Promise<AuthInfo> {
		if (!code) throw Error("No Code provided.");
		let authToken: AuthorizationTokenResponse = await this.authCodeToAuthToken(code, refresh).catch(reason => { throw Error("Code is invalid.") });
		let xbl: XboxServiceTokenResponse = await this.authTokenToXBL(authToken).catch(reason => { throw Error("Error during XBL Auth.") });
		let xstsJava: XboxServiceTokenResponse = await this.xblToXsts(xbl, RelyingParty.java).catch(reason => { throw Error("Error during XSTS (Java) Auth.") });
		let mcToken: MCTokenResponse = await this.xstsToMc(xstsJava).catch(reason => { throw Error("Error during Mojang Auth.") });
		let mcInfo: MCUserInfo = await this.getMCInfo(mcToken).catch(reason => { throw Error("Error during Minecraft Info Fetch. Does the user own Minecraft?") });

		let xstsBR: XboxServiceTokenResponse = await this.xblToXsts(xbl, RelyingParty.bedrock).catch(reason => { throw Error("Error during XSTS (Bedrock) Auth.") });
		let xstsXBox: XboxServiceTokenResponse = await this.xblToXsts(xbl, RelyingParty.xbox).catch(reason => { throw Error("Error during XSTS (Xbox) Auth.") });

		return {
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
		}
	}

	public async refreshTokenIfNeeded(token: AuthInfo): Promise<AuthInfo> {
		let refreshNeeded: boolean = false;
		let now: Date = new Date(Date.now());
		let aqDate: Date = new Date(token.aquired ?? 0);
		let authDate: Date = new Date(aqDate.valueOf() + 1000 * token.auth_token.expires_in);
		if(now > authDate){
			token.auth_token = await this.authCodeToAuthToken(token.auth_token.refresh_token, true).catch(reason => { throw Error("Couldn't refresh Auth Token.")});
			token.aquired = now.valueOf();
			refreshNeeded = true;
		}
		
		let xboxDate: Date = new Date(token.xbox_token.NotAfter);
		if(now > xboxDate || refreshNeeded) {
			token.xbox_token = await this.authTokenToXBL(token.auth_token).catch(reason => {throw Error("Error during XBL refresh.")});
			refreshNeeded = true;
		}

		for(let xsts in token.xsts_tokens){
			//@ts-ignore
			let xstsToken: XboxServiceTokenResponse = token.xsts_tokens[xsts];
			let xstsDate: Date = new Date(xstsToken.NotAfter);
			if(now > xstsDate || refreshNeeded) {
				//@ts-expect-error
				xstsToken = await this.xblToXsts(token.xbox_token, (<string>RelyingParty[xsts])).catch(reason => { throw Error(`Error during XSTS (${xsts}) refresh.`)});
				refreshNeeded = true;
			}
		}
		
		let mcDate: Date = new Date(token.mc_token.expires_in * 1000 + aqDate.valueOf());
		if(now > mcDate || refreshNeeded) {
			token.mc_token = await this.xstsToMc(token.xsts_tokens.java).catch(reason => { throw Error("Error during MC Token refresh.")});
			refreshNeeded = true;	
		}
		
		return token;
	}

	private async authCodeToAuthToken(code: string, refresh: boolean): Promise<AuthorizationTokenResponse> {
		let request = new XMLHttpRequest();
		let data = "client_id=" + this.clientId +
			"&client_secret=" + this.clientSecret +
			"&redirect_uri=" + this.redirectUri;
		if (refresh) {
			data += "&refresh_token=" + code +
				"&grant_type=refresh_token";
		} else {
			data += "&code=" + code +
				"&grant_type=authorization_code";
		}
		request.open("POST", "https://login.live.com/oauth20_token.srf");
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		let promise: Promise<AuthorizationTokenResponse> = this.waitForRequestText(request);
		request.send(data);
		return promise;
	}

	private async authTokenToXBL(authToken: AuthorizationTokenResponse): Promise<XboxServiceTokenResponse> {
		let request = new XMLHttpRequest();
		let data = `{
			"Properties": {
				"AuthMethod": "RPS",
				"SiteName": "user.auth.xboxlive.com",
				"RpsTicket": "d=${authToken.access_token}"
			},
			"RelyingParty": "http://auth.xboxlive.com",
			"TokenType": "JWT"
 		}`;
		request.open("POST", "https://user.auth.xboxlive.com/user/authenticate");
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		let promise: Promise<XboxServiceTokenResponse> = this.waitForRequestText(request);
		request.send(data);
		return promise;
	}

	private async xblToXsts(token: XboxServiceTokenResponse, relyingParty: RelyingParty): Promise<XboxServiceTokenResponse> {
		let request = new XMLHttpRequest();
		let data = `{
			"Properties": {
				"SandboxId": "RETAIL",
				"UserTokens": [
						"${token.Token}"
				]
			},
			"RelyingParty": "${relyingParty}",
			"TokenType": "JWT"
		}`;
		request.open("POST", "https://xsts.auth.xboxlive.com/xsts/authorize");
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		let promise: Promise<XboxServiceTokenResponse> = this.waitForRequestText(request);
		request.send(data);
		return promise;
	}

	private async xstsToMc(token: XboxServiceTokenResponse): Promise<MCTokenResponse> {
		let request = new XMLHttpRequest();
		let data = `{
			"identityToken": "XBL3.0 x=${token.DisplayClaims.xui[0].uhs};${token.Token}"
	 		}`;
		request.open("POST", "https://api.minecraftservices.com/authentication/login_with_xbox");
		request.setRequestHeader("Content-Type", "application/json");
		request.setRequestHeader("Accept", "application/json");
		let promise: Promise<MCTokenResponse> = this.waitForRequestText(request);
		request.send(data);
		return promise;
	}

	private async getMCInfo(mc_token: MCTokenResponse): Promise<MCUserInfo> {
		let request = new XMLHttpRequest();
		request.open("GET", "https://api.minecraftservices.com/minecraft/profile");
		request.setRequestHeader("Authorization", "Bearer " + mc_token.access_token);
		let promise: Promise<MCUserInfo> = this.waitForRequestText(request);
		request.send();
		return promise;
	}

	private async waitForRequestText(req: XMLHttpRequest): Promise<any> {
		return new Promise((resolve, reject) => {
			req.addEventListener("readystatechange", () => {
				if (req.readyState == 4) {
					if (req.status == 200) {
						resolve(JSON.parse(req.responseText));
					} else {
						console.error(req.status, req.statusText);
						reject(req.status);
					}
				}
			});
		});
	}
}