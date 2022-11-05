import express from "express";
import { gridfsbucketToko } from "../../database/index.js";
import ImageController from "../controller/image.controller.js";

const router = express.Router();
const controller = new ImageController();

router.get("/shop/:image_profile", async (req, res, next) => {
	await controller.getTokoImage(req, res, next);
});

router.get("/product-one/:_id", async (req, res, next) => {
	await controller.getProductOne(req, res, next);
});

router.get("/product-all/:id_product", async (req, res, next) => {
	await controller.getAllImageOfOneProduct(req, res, next);
});

router.get("/toko/:filename", async (req, res, next) => {
	await controller.sendImageToko(req, res, next);
});

router.get("/product/:filename", async (req, res, next) => {
	await controller.sendImageProduct(req, res, next);
});

export default router;
