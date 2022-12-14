import { socket } from "../../app.js";
import TokoDB from "../../database/db/toko.db.js";
import TransactionDB from "../../database/db/transaction.db.js";
import ErrorHandler from "../middleware/errHandler.middleware.js";

class TransactionController extends TransactionDB {
	constructor() {
		super();
		this.err = new ErrorHandler();
	}

	async makeTransaction(req, res, next) {
		try {
			const { name, alamat, contact, cart, _id_toko } = req.body;
			if (!name || !contact || !alamat) {
				return this.err.badRequest(res);
			}
			if (Array.isArray(cart) && cart.length) {
				let yes = false;
				for (let i = 0; i < cart.length; i++) {
					if (!cart[i].id_product || !cart[i].total_price || !cart[i].qt || !cart[i].product_uom || !cart[i].name) {
						yes = true;
					}
				}
				if (yes) {
					return res.status(400).send({
						status: res.statusCode,
						message: `Data body cart harus array degan object value id_product, qt, product_uom dan total_price`,
					});
				}
				let checkToko = await new TokoDB().findById(_id_toko);
				if (!checkToko) {
					return res.status(404).send({
						status: res.statusCode,
						message: `id toko tidak ditemukan!`,
					});
				}
				let array = cart.map((v, i) => {
					return {
						id_product: v.id_product,
						name: v.name,
						total_price: Number(v.total_price),
						qt: Number(v.qt),
						product_uom: v.product_uom,
					};
				});
				let sv = await this.createTransaction(name, alamat, contact, array, _id_toko);
				if (sv) {
					return res.status(200).send({
						status: res.statusCode,
						message: `Sukses Create Transaction id : ${sv.create._id}`,
						data: { transaction: sv.create, code: sv.createCode },
					});
				} else {
					return this.err.internalError(res);
				}
			} else {
				return res.status(400).send({
					status: res.statusCode,
					message: `Data body cart harus array degan object value id_product dan total_price`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async getTransaction(req, res, next) {
		try {
			const { _id } = req.params;
			if (!_id) {
				return this.err.badRequest(res);
			}
			let data = await this.getDataTransaction(_id);
			const code = await this.getCodeByTransactionId(_id);
			if (data && code) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses GET Transaction id : ${data._id}`,
					data: { transaction: data, code },
				});
			} else {
				res.status(404).send({
					status: res.statusCode,
					message: "Data Transaksi atau kode Tidak Ditemukan",
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async updateTransaction(req, res, next) {
		try {
			const { _id } = req.params;
			let { status } = req.body;
			if (!_id || !status) {
				return this.err.badRequest(res);
			}
			const up = await this.updateDataTransaction(_id, status);
			if (up) {
				const data = await this.getDataTransaction(_id);

				socket.emit("transaksi", { data });
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Update Data Transaksi : ${_id}`,
				});
			} else {
				res.status(404).send({
					status: res.statusCode,
					message: "Data Transaksi Tidak Ditemukan",
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async deleteTransaction(req, res, next) {
		try {
			const { _id } = req.params;
			if (!_id) {
				return this.err.badRequest(res);
			}
			const del = await this.deleteDataTransaction(_id);
			if (del) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Delete Data Transaksi : ${_id}`,
				});
			} else {
				res.status(404).send({
					status: res.statusCode,
					message: "Data Transaksi Tidak Ditemukan",
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default TransactionController;
