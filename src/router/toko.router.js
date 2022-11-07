import express from "express";
import TokoController from "../controller/toko.controller.js";
import { uploadToko } from "../middleware/multer.middleware.js";

const router = express.Router();
const controller = new TokoController();

router.get("/image/:image_profile", async (req, res, next) => {
	await controller.getTokoImage(req, res, next);
});

router.get("/data/:toko_id", async (req, res, next) => {
	await controller.dataToko(req, res, next);
});

router.put("/data/:toko_id", uploadToko.single("file"), async (req, res, next) => {
	await controller.updateToko(req, res, next);
});

router.delete("/data/:toko_id", async (req, res, next) => {
	await controller.deleteToko(req, res, next);
});

router.post("/createtoko", uploadToko.single("file"), async (req, res, next) => {
	await controller.createDataToko(req, res, next);
});

router.get("/transaction/:_id_toko", async (req, res, next) => {
	await controller.getDataTokoTransaction(req, res, next);
});

router.get("/all/:status?", async (req, res, next) => {
	await controller.getTokoStatus(req, res, next);
});

router.post("/code/claim", async (req, res, next) => {
	await controller.claimCode(req, res, next);
});

export default router;
