import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
		},
		transaction_id: {
			type: String,
			required: true,
		},
		claim: {
			type: Boolean,
			required: true,
		},
	},
	{ versionKey: false }
);

const Code = mongoose.model("code", CodeSchema);
export default Code;
