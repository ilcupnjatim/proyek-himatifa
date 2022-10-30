import mongoose from "mongoose";

const TokoSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		owner: {
			type: String,
			required: true,
		},
		image_profile: {
			type: String,
			required: true,
		},
		toko_id: {
			type: String,
			required: true,
		},
		product: {
			type: Array,
			required: true,
		},
	},
	{ versionKey: false }
);

const Toko = mongoose.model("toko", TokoSchema);
export default Toko;
