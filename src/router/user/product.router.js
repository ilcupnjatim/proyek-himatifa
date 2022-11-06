import express from "express";
import ProductUser from "../../controller/user/product.controller.js";

const router = express.Router();
const controller = new ProductUser();

router.get("/all", async (req, res, next) => {
	await controller.getAllProduct(req, res, next);
});

export default router;
