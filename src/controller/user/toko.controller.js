import { Types } from "mongoose";
import TokoDB from "../../../database/db/toko.db.js";
import { tokoFile } from "../../../database/index.js";
import ErrorHandler from "../../middleware/errHandler.middleware.js";

class UserTokoController extends TokoDB {
	constructor() {
		super();
		this.err = new ErrorHandler();
	}

	async getDataToko(req, res, next) {
		try {
			const { toko_id } = req.params;
			if (!toko_id) {
				return this.err.badRequest(res);
			}
			let ObjectId = Types.ObjectId;
			let checkID = ObjectId.isValid(toko_id) ? (String(new ObjectId(toko_id) === toko_id) ? true : false) : false;
			const data_id = checkID ? await this.findById(toko_id) : await this.findTokoId(toko_id);
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

	async getTokoImage(req, res, next) {
		try {
			const { image_profile } = req.params;
			const dataImg = await tokoFile.file.findOne({ _id: image_profile });
			if (dataImg) {
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses GET Data Image",
					data: dataImg,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Image Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default UserTokoController;
