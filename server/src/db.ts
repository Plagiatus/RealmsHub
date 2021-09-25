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
		this.tokens?.findOneAndUpdate({ id: _token.id }, _token, { upsert: true });
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