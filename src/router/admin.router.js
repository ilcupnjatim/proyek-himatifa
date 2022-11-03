import express from "express";
import authenticateToken from "../middleware/verifyToken.js";
import adminController from "../controller/admin.controller.js";

const router = express.Router();

router.post("/admin", async (req, res) => {
    await adminController.addAdmin(req, res);
});

router.get("/admin", authenticateToken, async (req, res) => {
    await adminController.getAdmin(req, res);
});

export default router;
