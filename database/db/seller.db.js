import Seller from "../model/seller.model.js";

class SellerDB {
	constructor() {
		this.seller = Seller;
	}

	async createSeller(username, name, email, password) {
		await this.seller.create({ username, name, email, password, image: [] });
	}

	async findOneEmail(email) {
		const data = await this.seller.findOne({ email });
		const result = data ? data : null;
		return result;
	}
}

export default SellerDB;
