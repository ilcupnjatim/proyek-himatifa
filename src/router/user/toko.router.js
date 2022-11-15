import express from "express";
import UserTokoController from "../../controller/user/toko.controller.js";

const router = express.Router();
const controller = new UserTokoController();

router.get("/data/:toko_id", async (req, res, next) => {
	await controller.getDataToko(req, res, next);
});

router.get("/image/:image_profile", async (req, res, next) => {
	await controller.getTokoImage(req, res, next);
});

export default router;
