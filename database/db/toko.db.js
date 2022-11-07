import { tokoFile } from "../index.js";
import Toko from "../model/toko.model.js";

class TokoDB {
	constructor() {
		this.toko = Toko;
	}

	async createToko(name = "", alamat = "", toko_id, owner = "", image_profile = "", status = 0) {
		let data = await this.toko.create({ name, alamat, toko_id, owner, image_profile, status, pendapatan_total: 0 });
		return data;
	}

	async findTokoByStatus(status) {
		if (status !== null) {
			var data = await this.toko.find({ status });
		} else {
			var data = await this.toko.find();
		}
		const result = data ? data : null;
		return result;
	}

	async findById(_id) {
		const data = await this.toko.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async findTokoId(toko_id) {
		const data = await this.toko.findOne({ toko_id });
		const result = data ? data : null;
		return result;
	}

	async findTokobyUserId(_id) {
		const data = await this.toko.findOne({ owner: _id });
		const result = data ? data : null;
		return result;
	}

	async updateTokoDB(name, toko_id, toko_id_update, alamatx, statusx) {
		let data = await this.toko.findOne({ toko_id });
		if (data) {
			let id = toko_id_update ? toko_id_update : data.toko_id;
			let alamat = alamatx ? alamatx : data.alamat;
			let status = statusx ? Number(statusx) : Number(data.status);
			await this.toko.updateOne({ toko_id }, { name: name ? name : data.name, toko_id: id, alamat, status });
			return await this.toko.findOne({ toko_id: id });
		} else {
			return null;
		}
	}

	async updatePendapatan(_id_toko, pendapatan_totalx) {
		let data = await this.toko.findOne({ _id: _id_toko });
		if (data) {
			let pendapatan_total = pendapatan_totalx ? Number(pendapatan_totalx) : Number(data.pendapatan_total);
			await this.toko.updateOne({ _id: _id_toko }, { pendapatan_total });
			return await this.toko.findOne({ _id: _id_toko });
		} else {
			return null;
		}
	}

	async deleteTokoDB(toko_id) {
		let data = await this.toko.findOne({ toko_id });
		if (data) {
			const dataImg = await tokoFile.file.findOne({ _id: data.image_profile });
			if (dataImg) await tokoFile.file.deleteOne({ _id: data.image_profile });

			const datachunk = await tokoFile.chunks.findOne({ files_id: data.image_profile });
			if (datachunk) await tokoFile.chunks.deleteOne({ files_id: data.image_profile });
			await this.toko.deleteOne({ toko_id });
			return true;
		}
	}
}

export default TokoDB;
