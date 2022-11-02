import express from "express";
import passport from "passport";
import SellerDB from "../../database/db/seller.db.js";
import AuthController from "../controller/auth.controller.js";

const router = express.Router();
const controller = new AuthController();

router.post("/signup", async (req, res, next) => {
	await controller.signUp(req, res, next);
});
router.post("/signin", async (req, res, next) => {
	await controller.signIn(req, res, next);
});
router.get("/logout", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
	await controller.logout(req, res, next);
});

router.get("/all", async (req, res, next) => {
	let { id } = req.query;
	let data = await new SellerDB().getAllSeller(id);
	return res.send({ status: 200, data });
});

export default router;
