import mongoose from "mongoose";

const StarSchema = new mongoose.Schema(
	{
		star: {
			type: Number,
			required: true,
		},
		id_product: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

const Star = mongoose.model("star", StarSchema);
export default Star;
