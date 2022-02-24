import express from "express";
import { authHandler, clients, db, latestVersion, tokens, tokenTimestamps } from ".";
import { AuthInfo } from "../../ms-api";
import { RealmsClientJava} from "../../realms-api";
import { AuthTokenInDB } from "./db";

export function wrongMethod(req: express.Request, res: express.Response) {
	res.sendStatus(405);
}

export function anErrorOccured(error: Error, res: express.Response) {
	res.send({
		error: {
			code: 500,
			message: error.message
		}
	})
}

export async function checkAndInitAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
	let id = req.body?.id as string;
	if (!id || typeof id != "string") {
		res.sendStatus(401);
		return;
	}
	if (!tokenTimestamps.has(id)) {
		let dbToken = await db.getToken(id);
		if (!dbToken) {
			res.sendStatus(401);
			return;
		} else {
			try {
				await authHandler.refreshTokenIfNeeded(dbToken);
			} catch (error) {
				res.sendStatus(401);
				return;
			}
			initAuth(id, dbToken);
		}
	}
	tokenTimestamps.set(id, Date.now());
	return next();
}

export function initAuth(_id: string, _token: AuthInfo) {
	tokenTimestamps.set(_id, Date.now());
	tokens.set(_id, _token);
	clients.set(_id, new RealmsClientJava(latestVersion, _token.mc_token.access_token, _token.mc_info.id, _token.mc_info.name));
	let tokenInDB: AuthTokenInDB = { ..._token, id: _id };
	db.saveToken(tokenInDB);
}