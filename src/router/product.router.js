import express from "express";
import ProductController from "../controller/product.controller.js";
import { uploadProduct } from "../middleware/multer.middleware.js";

const router = express.Router();
const controller = new ProductController();

router.post("/create-product/:toko_id", uploadProduct.array("files", 5), async (req, res, next) => {
	await controller.createProductToko(req, res, next);
});

router.put("/:toko_id/:id_product", uploadProduct.array("files", 5), async (req, res, next) => {
	await controller.updateProductToko(req, res, next);
});

router.get("/:id_product", async (req, res, next) => {
	await controller.getProductToko(req, res, next);
});

router.delete("/:id_product", async (req, res, next) => {
	await controller.deleteProductToko(req, res, next);
});

export default router;
