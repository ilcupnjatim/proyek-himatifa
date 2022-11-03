import { productFile } from "../index.js";
import Product from "../model/product.model.js";
import Toko from "../model/toko.model.js";

class ProductDB {
	constructor() {
		this.product = Product;
		this.toko = Toko;
	}

	async createProduct(_id, id_product, toko_id, name, price, qt, image, product_uom, product_category = []) {
		let seller = await Toko.findOne({ _id: toko_id });
		let data = await this.product.create({ _id, id_product, toko_id, name, price, qt, image, product_uom, product_category });
		if (seller) {
			await Toko.updateOne({ _id: toko_id }, { $push: { product: data } });
		}
		return { _id, id_product, toko_id, name, price, qt, image, product_uom, product_category };
	}

	async pushImage(_id, image) {
		const data = await this.product.findOne({ _id });
		if (data) {
			await this.product.updateOne({ _id }, { $push: { image } });
		}
	}

	async findDatabyId(_id) {
		const data = await this.product.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async findDatabyProductId(id_product) {
		const data = await this.product.findOne({ id_product });
		const result = data ? data : null;
		return result;
	}

	async deleteAllImage(id_product) {
		let data = await this.product.findOne({ id_product });
		if (data) {
			data.image.map(async (v) => {
				const dataImg = await productFile.file.findOne({ _id: v.id });
				if (dataImg) await productFile.file.deleteOne({ _id: v.id });

				const datachunk = await productFile.chunks.findOne({ files_id: v.id });
				if (datachunk) await productFile.chunks.deleteOne({ files_id: v.id });
			});
		}
	}

	async updateProductData(id_product, namex, qtx, pricex, image, product_uomx, product_categoryx = []) {
		let data = await this.findDatabyProductId(id_product);
		if (data) {
			await this.deleteAllImage(id_product);
			let name = namex ? namex : data.name;
			let qt = qtx ? qtx : data.qt;
			let price = pricex ? pricex : data.price;
			let product_uom = product_uomx ? product_uomx : data.product_uom;
			let product_category = Array.isArray(product_categoryx) && product_categoryx.length ? product_categoryx : [];
			let product_tokos = await Toko.findOne({ product: { $elemMatch: { id_product } } });
			if (product_tokos) {
				let upData = { id_product: data.id_product, toko_id: data.toko_id, name, price, qt, image, _id: data._id, product_uom, product_category };
				let array = product_tokos.product;
				let indexes = array.findIndex((x) => x.id_product == id_product);
				array[indexes] = upData;
				await product_tokos.updateOne({ product: array });
			}
			await this.product.updateOne({ id_product }, { name, qt, price, image, product_uom, product_category });
			return await this.findDatabyProductId(id_product);
		}
	}

	async deleteDataProduct(id_product) {
		const data = await this.product.findOne({ id_product });
		if (data) {
			data.image.map(async (v) => {
				const dataImg = await productFile.file.findOne({ _id: v.id });
				if (dataImg) await productFile.file.deleteOne({ _id: v.id });

				const datachunk = await productFile.chunks.findOne({ files_id: v.id });
				if (datachunk) await productFile.chunks.deleteOne({ files_id: v.id });
			});
			let tokos = await Toko.findOne({ image: { $elemMatch: { id_product } } });
			if (tokos) {
				await tokos.updateOne({ $pull: { product: { id_product } } });
			}
			await this.product.deleteOne({ id_product });
		}
	}
}

export default ProductDB;
