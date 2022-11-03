import express from "express";
import TransactionController from "../controller/transaction.controller.js";

const router = express.Router();
const controller = new TransactionController();

router.post("/createtransaction", async (req, res, next) => {
	await controller.makeTransaction(req, res, next);
});

router.get("/data/:_id", async (req, res, next) => {
	await controller.getTransaction(req, res, next);
});

router.put("/data/:_id", async (req, res, next) => {
	await controller.updateTransaction(req, res, next);
});

router.delete("/data/:_id", async (req, res, next) => {
	await controller.deleteTransaction(req, res, next);
});

export default router;
