import mongoose from "mongoose";

let adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "This field is required",
    },
    password: {
        type: String,
        required: "This field is required",
    },
});

const adminModel = mongoose.model("admin", adminSchema);
export default adminModel;
