import express from "express";
import AuthenticationHandler from "../../ms-api";

const app = express();

const clientId = "cf8b68fc-eb1a-442f-ae01-5fa94adce065";
const clientSecret = "Kn7e34~A0-_Yu__u8KTn295OtC5vZW30-E";
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