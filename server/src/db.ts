import * as mongo from "mongodb";
import { AuthInfo } from "../../ms-api";

const options: mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const client = new mongo.MongoClient("mongodb://localhost:27017", options);

export class DB {
	client: mongo.MongoClient | null = null;
	tokens: mongo.Collection | null = null;

	constructor() {

	}

	public async connect() {
		if (this.client) return;
		this.client = await client.connect();
		this.tokens = client.db("Realmshub").collection("Tokens");
		return;
	}

	public async saveToken(_token: AuthTokenInDB): Promise<void> {
		this.tokens?.updateOne({ id: _token.id }, {$set: {id: _token.id, auth_token: _token.auth_token, mc_info: _token.mc_info, mc_token: _token.mc_token, xbox_token: _token.xbox_token, xsts_token: _token.xsts_token}}, { upsert: true });
	}

	public async getToken(_id: string): Promise<AuthTokenInDB | null | undefined> {
		return this.tokens?.findOne({ id: _id }) as AuthTokenInDB | null | undefined;
	}

	public async removeToken(_id: string): Promise<void> {
		this.tokens?.findOneAndDelete({id: _id});
	}
}

export interface AuthTokenInDB extends AuthInfo {
	id: string;
}