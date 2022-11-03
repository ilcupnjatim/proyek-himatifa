import express from "express";
const router = express.Router();

import authAdminController from "../controller/authAdmin.controller.js";

router.post("/login", async (req, res) => {
    await authAdminController.loginAdmin(req, res);
});

export default router;
