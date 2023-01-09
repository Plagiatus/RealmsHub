import express from "express";
import {AuthenticationHandler} from "../../ms-api";

const app = express();

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
	let result = await ah.getAuthCodes(code);
	res.json(result);
});

app.listen(3000);