import express from "express";
const router = express.Router();

import authAdminController from "../controller/authAdmin.controller.js";

router.post("/login", async (req, res, next) => {
    console.log(req.body);
    await authAdminController.loginAdmin(req, res, next);
});

router.get(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
        await authAdminController.logoutAdmin(req, res, next);
    }
);

export default router;
