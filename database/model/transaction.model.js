import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		alamat: {
			type: String,
			required: true,
		},
		contact: {
			type: String,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
		_id_toko: {
			type: String,
			required: true,
		},
		dateCustom: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		cart: [
			{
				id_product: { type: String, required: true },
				name: { type: String, required: true },
				total_price: { type: Number, required: true },
				qt: { type: Number, required: true },
				product_uom: { type: String, required: true },
			},
		],
	},
	{ versionKey: false }
);

const Transaction = mongoose.model("transaction", TransactionSchema);
export default Transaction;
