import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
	{
		id_product: {
			type: String,
			required: true,
		},
		toko_id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		qt: {
			type: Number,
			required: true,
		},
		image: {
			type: Array,
			required: true,
		},
	},
	{ versionKey: false }
);

const Product = mongoose.model("product", ProductSchema);
export default Product;
