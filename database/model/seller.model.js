import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
	},
	{ versionKey: false }
);

const Seller = mongoose.model("seller", SellerSchema);
export default Seller;
