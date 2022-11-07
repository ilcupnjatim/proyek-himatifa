import express from "express";
import TransactionUser from "../../controller/user/transaction.controller.js";

const router = express.Router();
const controller = new TransactionUser();

router.get("/", async (req, res, next) => {
    await controller.getTransaction(req, res, next);
});

export default router;
