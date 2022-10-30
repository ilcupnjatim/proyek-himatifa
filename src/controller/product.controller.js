import mongoose from "mongoose";
import ProductDB from "../../database/db/product.db.js";
import TokoDB from "../../database/db/toko.db.js";
import { productFile } from "../../database/index.js";
import ErrorHandler from "../middleware/errHandler.middleware.js";

class ProductController extends ProductDB {
	constructor() {
		super();
		this.err = new ErrorHandler();
		this.toko = new TokoDB();
	}

	async createProductToko(req, res, next) {
		try {
			const { toko_id } = req.params;
			const { name, qt, price } = req.body;
			if (!name || !qt || !price) {
				return this.err.badRequest(res);
			}
			let dataToko = await this.toko.findById(toko_id);
			if (dataToko) {
				const _id = new mongoose.mongo.ObjectId();
				const id_product = `${name.replaceAll(" ", "-").replaceAll(".", "")}.${_id}.${toko_id}`;
				let data = await this.createProduct(_id, id_product, toko_id, name, Number(price), Number(qt));

				req.files.map(async (value, index) => {
					data.image.push({ id: value.id, filename: value.filename });
				});

				req.files.map(async (value, index) => {
					await this.pushImage(data._id, { id: value.id, filename: value.filename });
					data.image.push({ id: value.id, filename: value.filename });
				});
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Create Product!`,
					data,
					files: req.files,
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

	async updateProductToko(req, res, next) {
		try {
			const { id_product, toko_id } = req.params;
			const { name, qt, price } = req.body;
			if (!id_product) {
				return this.err.badRequest(res);
			}
			let data = await this.findDatabyProductId(id_product);
			if (data) {
				let images = req.files.map((value, index) => {
					return { id: value.id, filename: value.filename };
				});
				let up = await this.updateProductData(id_product, name, qt, price, images);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Update Data Toko`,
					data: up,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Product Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async getProductToko(req, res, next) {
		try {
			const { id_product } = req.params;
			if (!id_product) {
				return this.err.badRequest(res);
			}
			let data = await this.findDatabyProductId(id_product);
			if (data) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get Data Product!`,
					data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Product Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async deleteProductToko(req, res, next) {
		try {
			const { id_product } = req.params;
			if (!id_product) {
				return this.err.badRequest(res);
			}
			let data = await this.findDatabyProductId(id_product);
			if (data) {
				await this.deleteDataProduct(id_product);
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Delete Data Product!`,
					data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Product Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default ProductController;
