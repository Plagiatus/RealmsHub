import express from "express";
import {AuthenticationHandler} from "../../ms-api";
// @ts-expect-error
import { XMLHttpRequest } from "xmlhttprequest";

const app = express();

// const clientId = "cf8b68fc-eb1a-442f-ae01-5fa94adce065";
// const clientSecret = "Kn7e34~A0-_Yu__u8KTn295OtC5vZW30-E";
const clientId = "6f26d7ba-f750-4876-a812-a8efcd652e8e";
const clientSecret = "L597Q~dzRru3whr-hqVzg4YvmSwiY8rqoKw0l";
const redirectUri = "http://localhost:3000/redirect";

const ah = new AuthenticationHandler(clientId, clientSecret, redirectUri);

app.get("/", (req, res) => {
	res.redirect(ah.forwardUrl);
});

app.get("/redirect", async (req, res) => {
	let code: string = req.query.code as string;
	if(!code) {
		res.send("Error, code could not be retrieved.");
		return;
	}
	// let result = await ah.getAuthCodesBedrock(code);
	let result = await ah.getAuthCodes(code);
	res.json(result);
	console.log("done");

	let request = new XMLHttpRequest();
	request.open("GET", "https://pocket.realms.minecraft.net/worlds");
	request.setRequestHeader("Authorization", `XBL3.0 x=${result.xsts_tokens.bedrock.DisplayClaims.xui[0].uhs};${result.xsts_tokens.bedrock.Token}`);
	request.setRequestHeader("Client-Version", "1.18.120");
	request.setRequestHeader("User-Agent", "MCPE/UWP");

	let responsePromise = waitForRequestResponse(request);
	request.send();
	let response = await responsePromise;
	console.log(response);

});

app.listen(3000);

async function waitForRequestResponse(req: XMLHttpRequest): Promise<any | RequestError> {
	return new Promise((resolve, reject) => {
		req.addEventListener("readystatechange", () => {
			if (req.readyState == 4) {
				if (req.status == 200) {
					resolve(req.responseText);
				} else if (req.status == 204) {
					resolve(true);
				} else {
					let re: RequestError = { code: req.status, message: req.statusText };
					console.error(req.status, req.statusText);
					if (req.responseText != "")
						resolve(req.responseText);
					else
						resolve(JSON.stringify(re));
				}
			}
		});
	});
}