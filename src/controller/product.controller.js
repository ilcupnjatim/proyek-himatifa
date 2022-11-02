import mongoose from "mongoose";
import ProductDB from "../../database/db/product.db.js";
import StarDB from "../../database/db/star.db.js";
import TokoDB from "../../database/db/toko.db.js";
import { productFile } from "../../database/index.js";
import ErrorHandler from "../middleware/errHandler.middleware.js";

class ProductController extends ProductDB {
	constructor() {
		super();
		this.err = new ErrorHandler();
		this.toko = new TokoDB();
		this.star = new StarDB();
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

				let image = req.files.map((value, index) => {
					// await this.pushImage(_id, { id: value.id, filename: value.filename });
					return { id: value.id, filename: value.filename };
				});
				let data = await this.createProduct(_id, id_product, toko_id, name, Number(price), Number(qt), image);

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
			const { name, qt, price, alamat } = req.body;
			if (!id_product) {
				return this.err.badRequest(res);
			}
			let data = await this.findDatabyProductId(id_product);
			if (data) {
				let images = req.files.map((value, index) => {
					return { id: value.id, filename: value.filename };
				});
				let up = await this.updateProductData(id_product, name, qt, price, images, alamat);
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
				let starData = await this.star.getStar(id_product);
				let isMap = Array.isArray(starData) && starData.length ? starData : [];
				let stars = isMap.map((v, i) => {
					return v.star;
				});
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get Data Product!`,
					data: { product: data, stars },
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
				await this.star.deleteStar(id_product);
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

	async starProduct(req, res, next) {
		try {
			const { id_product } = req.params;
			const { star } = req.body;
			if (!star || !id_product) {
				return this.err.badRequest(res);
			}
			await this.star.addStar(star, id_product);
			return res.status(200).send({
				status: res.statusCode,
				message: `Add Product Star ${id_product} : ${star}`,
			});
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default ProductController;
