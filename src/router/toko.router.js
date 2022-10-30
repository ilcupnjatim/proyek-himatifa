import express from "express";
import TokoController from "../controller/toko.controller.js";
import { uploadToko } from "../middleware/multer.middleware.js";

const router = express.Router();
const controller = new TokoController();

router.get("/:toko_id", async (req, res, next) => {
	await controller.dataToko(req, res, next);
});

router.put("/:toko_id", uploadToko.single("file"), async (req, res, next) => {
	await controller.updateToko(req, res, next);
});

router.delete("/:toko_id", async (req, res, next) => {
	await controller.deleteToko(req, res, next);
});

router.post("/createtoko", uploadToko.single("file"), async (req, res, next) => {
	await controller.createDataToko(req, res, next);
});

export default router;
