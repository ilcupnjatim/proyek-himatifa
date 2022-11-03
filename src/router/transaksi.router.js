import express from "express";
const router = express.Router();
import authenticateToken from "../middleware/verifyToken.js";
import _transaksi from "../controller/transaksi.controller.js";

router.post("/transaksi", async (req, res) => {
    await _transaksi.addTransaksi(req, res);
});

router.get("/transaksi", async (req, res) => {
    await _transaksi.readTransaksi(req, res);
});

router.put("/transaksi", async (req, res) => {
    await _transaksi.updateTransaksi(req, res);
});

export default router;
