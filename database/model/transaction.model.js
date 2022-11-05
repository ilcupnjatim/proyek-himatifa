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
		toko_id: {
			type: String,
			required: true,
		},
		cart: {
			type: Array,
			required: true,
		},
	},
	{ versionKey: false }
);

const Transaction = mongoose.model("transaction", TransactionSchema);
export default Transaction;
