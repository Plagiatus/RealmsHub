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

interface XboxServiceTokenResponse {
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

interface AuthInfo {
	auth_token: AuthorizationTokenResponse,
	xbox_token: XboxServiceTokenResponse,
	xsts_token: XboxServiceTokenResponse,
	mc_token: MCTokenResponse,
	mc_info: MCUserInfo
}

interface DisplayClaim {
	xui: {
		uhs: string;
	}[]
}

export default class AuthenticationHandler {
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
		let authToken: AuthorizationTokenResponse = await this.authCodeToAuthToken(code, refresh);
		let xbl: XboxServiceTokenResponse = await this.authTokenToXBL(authToken);
		let xsts: XboxServiceTokenResponse = await this.xblToXsts(xbl);
		let mcToken: MCTokenResponse = await this.xstsToMc(xsts);
		let mcInfo: MCUserInfo = await this.getMCInfo(mcToken);

		return {
			auth_token: authToken,
			mc_info: mcInfo,
			mc_token: mcToken,
			xbox_token: xbl,
			xsts_token: xsts
		}
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

	private async xblToXsts(token: XboxServiceTokenResponse): Promise<XboxServiceTokenResponse> {
		let request = new XMLHttpRequest();
		let data = `{
			"Properties": {
				"SandboxId": "RETAIL",
				"UserTokens": [
						"${token.Token}"
				]
			},
			"RelyingParty": "rp://api.minecraftservices.com/",
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
						reject();
					}
				}
			});
		});
	}
}