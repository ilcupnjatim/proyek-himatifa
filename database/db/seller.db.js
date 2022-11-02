import Seller from "../model/seller.model.js";

class SellerDB {
	constructor() {
		this.seller = Seller;
	}

	async createSeller(username, name, email, password) {
		await this.seller.create({ username, name, email, password, image: [] });
	}

	async getAllSeller(id) {
		if (id) {
			var array = await this.seller.find({ _id: id });
		} else {
			var array = await this.seller.find();
		}
		return array;
	}

	async getSellerId(_id) {
		const data = await this.seller.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async findOneEmail(email) {
		const data = await this.seller.findOne({ email });
		const result = data ? data : null;
		return result;
	}
}

export default SellerDB;
