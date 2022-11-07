import { socket } from "../../app.js";
import SellerDB from "../../database/db/seller.db.js";
import TokoDB from "../../database/db/toko.db.js";
import TransactionDB from "../../database/db/transaction.db.js";
import { tokoFile } from "../../database/index.js";
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
				socket.emit("toko", { data: up });
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

	async getDataTokoTransaction(req, res, next) {
		try {
			const { _id_toko } = req.params;
			const { tanggal, bulan, tahun } = req.query;
			const array = await new TransactionDB().getAllTokoTransaction(_id_toko);
			if (tanggal) {
				var fix = array.filter((x) => x.dateCustom.split("/")[0] == tanggal);
			} else if (bulan) {
				var fix = array.filter((x) => x.dateCustom.split("/")[1] == bulan);
			} else if (tahun) {
				var fix = array.filter((x) => x.dateCustom.split("/")[2].split(" ")[0] == tahun);
			} else {
				var fix = array;
			}
			return res.status(200).send({
				status: res.statusCode,
				message: `GET All Transaksi dari toko : ${_id_toko}`,
				data: fix,
			});
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async claimCode(req, res, next) {
		try {
			const { code } = req.body;
			if (!code) {
				return this.err.badRequest(res);
			}
			const check = await new TransactionDB().findCode(code);
			if (check && check.claim == false) {
				let tokoNya = await new TransactionDB().getDataTransaction(check.transaction_id);
				const isUser = await this.findById(tokoNya._id_toko);
				if (isUser && isUser.owner == req.user._id) {
					let total_prices = Number(isUser.pendapatan_total);
					for (let i = 0; i < tokoNya.cart.length; i++) {
						total_prices += tokoNya.cart[i].total_price;
					}
					let up = await this.updatePendapatan(tokoNya._id_toko, total_prices);
					if (up) {
						let dataCode = await new TransactionDB().updateClaim(code);
						const data = await new TransactionDB().getDataTransaction(dataCode.transaction_id);
						socket.emit("transaksi", { data });
						return res.status(200).send({
							status: res.statusCode,
							message: `Sukses Update Pendapatan toko : ${tokoNya._id_toko}`,
							data: up,
							code: dataCode,
						});
					} else {
						return res.status(404).send({
							status: res.statusCode,
							message: `Data Toko Tidak Ditemukan`,
						});
					}
				} else {
					return res.status(404).send({
						status: res.statusCode,
						message: `Data User dan Claim Code Tidak Sesuai!`,
					});
				}
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Code Tidak Ditemukan Atau Sudah Di Claim`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default TokoController;
