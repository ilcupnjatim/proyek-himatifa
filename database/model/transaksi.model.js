import mongoose from "mongoose";

let transaksiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "This field is required",
    },
    address: {
        type: String,
        required: "This field is required",
    },
    contact: {
        type: Number,
        required: "This field is required",
    },
    status: {
        type: Number,
        required: true,
    },
    wishlist: {
        type: Array,
        required: true,
    },
});

const transaksiModel = mongoose.model("transaksi", transaksiSchema);
export default transaksiModel;
