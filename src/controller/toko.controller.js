import SellerDB from "../../database/db/seller.db.js";
import TokoDB from "../../database/db/toko.db.js";
import ErrorHandler from "../middleware/errHandler.middleware.js";

class TokoController extends TokoDB {
	constructor() {
		super();
		this.err = new ErrorHandler();
	}

	async createDataToko(req, res, next) {
		try {
			const { name, toko_id, alamat } = req.body;
			if (!name || !toko_id || !req.file || !alamat) {
				return this.err.badRequest(res);
			}
			if (toko_id.match(/^\S*$/) == null) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Id Toko Tidak boleh ada Spasi`,
				});
			}
			const data_id = await this.findTokoId(toko_id);
			const toko_user_id = await this.findTokobyUserId(req.user._id);
			if (data_id || toko_user_id) {
				return res.status(404).send({
					status: res.statusCode,
					message: `Id Toko sudah terpakai atau anda Sudah pernah create toko sebelumnya!`,
				});
			} else {
				let datas = await this.createToko(name, alamat, toko_id, req.user._id, req.file.id);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Create Toko!`,
					data: datas,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async dataToko(req, res, next) {
		try {
			const { toko_id } = req.params;
			if (!toko_id) {
				return this.err.badRequest(res);
			}
			const data_id = await this.findTokoId(toko_id);
			if (data_id) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Data Toko Ditemukan!`,
					data: data_id,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Toko Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async updateToko(req, res, next) {
		try {
			const { toko_id } = req.params;
			const { name, toko_id_update, alamat, status } = req.body;
			const data_id = await this.findTokoId(toko_id);
			if (data_id) {
				let up = await this.updateTokoDB(name, toko_id, toko_id_update, alamat, status);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Update Data Toko`,
					data: up,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Toko Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async deleteToko(req, res, next) {
		try {
			const { toko_id } = req.params;
			if (!toko_id) {
				return this.err.badRequest(res);
			}
			const data_id = await this.findTokoId(toko_id);
			if (data_id) {
				await this.deleteTokoDB(toko_id);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Delete Data Toko`,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Toko Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async getTokoStatus(req, res, next) {
		try {
			let { status } = req.params;
			let stts = status ? Number(status) : null;
			let array = await this.findTokoByStatus(stts);
			return res.status(200).send({
				status: res.statusCode,
				message: `GET ALL Toko Status : ${stts !== null ? stts : "ALL"}`,
				data: array,
			});
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default TokoController;
