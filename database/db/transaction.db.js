import { moment } from "../../lib/moment.js";
import { randomText } from "../../lib/random.js";
import Code from "../model/code.model.js";
import Transaction from "../model/transaction.model.js";

class TransactionDB {
	constructor() {
		this.model = Transaction;
		this.code = Code;
	}

	async createTransaction(name, alamat, contact, cart = [], _id_toko) {
		let code = randomText(10);
		let date = moment().format("DD/MM/YY HH:mm:ss");
		let create = await this.model.create({ name, alamat, contact, cart, status: 0, _id_toko, dateCustom: date });
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

	async getAllTokoTransaction(_id_toko) {
		const array = await this.model.find({ _id_toko });
		return array;
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
