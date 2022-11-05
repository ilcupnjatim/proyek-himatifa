import mongoose from "mongoose";
import redis from "redis";

let client = null;
let tokoFile = { file: null, chunks: null };
let productFile = { file: null, chunks: null };
let gridfsbucketToko;
let gridfsbucketProduct;

class Connection {
	constructor() {}

	connectMongo() {
		const connection = mongoose.connect(process.env.db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const database = mongoose.connection;
		database.on("error", console.error.bind(console, "connection error:"));
		database.once("open", () => {
			gridfsbucketToko = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
				bucketName: "toko",
			});
			gridfsbucketProduct = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
				bucketName: "product",
			});
			tokoFile.file = database.collection(`toko.files`);
			tokoFile.chunks = database.collection(`toko.chunks`);
			productFile.file = database.collection(`product.files`);
			productFile.chunks = database.collection(`product.chunks`);
			console.log(`[DB] MongoDB Connected!`);
		});

		return connection;
	}

	async connectRedis() {
		client = redis.createClient({
			url: process.env.REDIS_URL,
		});
		client.on("error", (error) => {
			console.log(`Ini Error Redis : ${error}`);
		});
		client.on("connect", () => {
			console.log("[DB] Redis Connected!");
		});

		await client.connect();
	}
}

const conn = new Connection();
const db = conn.connectMongo();

export { db, conn, tokoFile, productFile, client, gridfsbucketToko, gridfsbucketProduct };
