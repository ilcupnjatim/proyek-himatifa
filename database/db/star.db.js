import Star from "../model/star.model.js";

class StarDB {
	constructor() {
		this.star = Star;
	}

	async addStar(star, id_product) {
		let db = await this.star.create({ star, id_product });
		return db;
	}

	async getStar(id_product) {
		const db = await this.star.find({ id_product });
		const result = Array.isArray(db) && db.length ? db : null;
		return result;
	}

	async deleteStar(id_product) {
		const db = await this.star.findOne({ id_product });
		if (db) {
			await this.star.deleteMany({ id_product });
		}
	}
}

export default StarDB;
