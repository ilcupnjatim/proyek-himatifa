import { randomText } from "../../lib/random.js";
import Code from "../model/code.model.js";
import Transaction from "../model/transaction.model.js";

class TransactionDB {
	constructor() {
		this.model = Transaction;
		this.code = Code;
	}

	async createTransaction(name, alamat, contact, cart = [], toko_id) {
		let code = randomText(10);
		let create = await this.model.create({ name, alamat, contact, cart, status: 0, toko_id });
		let createCode = await this.code.create({ transaction_id: create._id, code, claim: false });
		return { create, createCode };
	}

	async getDataTransaction(_id) {
		const data = await this.model.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async updateDataTransaction(_id, status) {
		const data = await this.model.findOne({ _id });
		if (data) {
			await this.model.updateOne({ _id }, { status: Number(status) });
			return true;
		}
	}

	async deleteDataTransaction(_id) {
		const data = await this.model.findOne({ _id });
		if (data) {
			await this.model.deleteOne({ _id });
			return true;
		}
	}

	async findCode(code) {
		const data = await this.code.findOne({ code });
		const result = data ? data : null;
		return result;
	}

	async updateClaim(code) {
		const data = await this.code.findOne({ code });
		if (data) {
			let up = await this.code.updateOne({ code }, { claim: true });
			if (up) return await this.code.findOne({ code });
		}
	}
}

export default TransactionDB;
