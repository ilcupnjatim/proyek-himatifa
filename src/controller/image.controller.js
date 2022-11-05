import mongoose from "mongoose";
import fs from "fs";
import { gridfsbucketProduct, gridfsbucketToko, productFile, tokoFile } from "../../database/index.js";
import Product from "../../database/model/product.model.js";
import Toko from "../../database/model/toko.model.js";
import ErrorHandler from "../middleware/errHandler.middleware.js";

class ImageController {
	constructor() {
		this.err = new ErrorHandler();
	}

	async sendImageToko(req, res, next) {
		try {
			const { filename } = req.params;
			if (!filename) {
				return this.err.badRequest(res);
			}
			const readStream = gridfsbucketToko.openDownloadStreamByName(filename);
			readStream.on("data", (chunk) => {
				res.write(chunk);
			});
			readStream.on("end", () => {
				res.status(200).end();
			});
			readStream.on("error", (err) => {
				res.status(500).send(err);
			});
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async sendImageProduct(req, res, next) {
		try {
			const { filename } = req.params;
			if (!filename) {
				return this.err.badRequest(res);
			}
			const readStream = gridfsbucketProduct.openDownloadStreamByName(filename);
			readStream.on("data", (chunk) => {
				res.write(chunk);
			});
			readStream.on("end", () => {
				res.status(200).end();
			});
			readStream.on("error", (err) => {
				res.status(500).send(err);
			});
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async getTokoImage(req, res, next) {
		try {
			let { image_profile } = req.params;
			let findImage = await tokoFile.file.findOne({ _id: image_profile });
			if (findImage) {
				let chunk = await tokoFile.chunks.findOne({ files_id: findImage._id });
				if (!chunk) {
					return res.status(404).send({
						status: res.statusCode,
						message: `Data Chunk Image Toko Tidak Ditemukan`,
					});
				}
				let data = { file: findImage, chunk };
				return res.status(200).send({
					status: res.statusCode,
					data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data File Image Toko Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async getProductOne(req, res, next) {
		try {
			let { _id } = req.params;
			let findImage = await productFile.file.findOne({ _id: mongoose.Types.ObjectId(_id) });
			if (findImage) {
				let chunk = await productFile.chunks.findOne({ files_id: mongoose.Types.ObjectId(_id) });
				if (!chunk) {
					return res.status(404).send({
						status: res.statusCode,
						message: `Data Chunk Image Product Tidak Ditemukan`,
					});
				}
				let data = { file: findImage, chunk };
				fs;
				return res.status(200).send({
					status: res.statusCode,
					data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data File Image Product Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}

	async getAllImageOfOneProduct(req, res, next) {
		try {
			let { id_product } = req.params;
			let findToko = await Product.findOne({ id_product });
			if (findToko) {
				let arrayImage = findToko.image;
				let image = await Promise.all(
					arrayImage.map(async (v, i) => {
						let findImage = await productFile.file.findOne({ _id: mongoose.Types.ObjectId(v.id) });
						if (findImage) {
							let chunk = await productFile.chunks.findOne({ files_id: mongoose.Types.ObjectId(v.id) });
							if (chunk) {
								return { file: findImage, chunk };
							}
						}
					})
				);
				return res.status(200).send({
					status: res.statusCode,
					message: "Get Image Product",
					data: image,
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
}

export default ImageController;
