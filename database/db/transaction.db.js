import Transaction from "../model/transaction.model.js";

class TransactionDB {
	constructor() {
		this.model = Transaction;
	}

	async createTransaction(name, alamat, contact, cart = []) {
		let create = await this.model.create({ name, alamat, contact, cart, status: 0 });
		return create;
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
}

export default TransactionDB;
