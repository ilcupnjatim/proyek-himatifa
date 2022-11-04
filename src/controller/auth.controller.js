import passport from "passport";
import jwt from "jsonwebtoken";

import SellerDB from "../../database/db/seller.db.js";
import ErrorHandler from "../middleware/errHandler.middleware.js";
import { getHashedPassword } from "../../lib/crypto.js";
import { client } from "../../database/index.js";
import TokoDB from "../../database/db/toko.db.js";

class AuthController extends SellerDB {
    constructor() {
        super();
        this.err = new ErrorHandler();
        this.toko = new TokoDB();
    }

    async signUp(req, res, next) {
        try {
            const { username, name, email, password, confirmPassword } =
                req.body;
            if (!username || !name || !email || !password || !confirmPassword) {
                return this.err.badRequest(res);
            }

            const data = await this.findOneEmail(email);
            if (!data) {
                if (password.length >= 6) {
                    if (password == confirmPassword) {
                        const hash = getHashedPassword(password);
                        await this.createSeller(username, name, email, hash);
                        return res.status(200).send({
                            status: res.statusCode,
                            message: `Succes Create Account Email : ${email}`,
                        });
                    } else {
                        return res.status(400).send({
                            status: res.statusCode,
                            message: `Password Tidak Sama!`,
                        });
                    }
                } else {
                    return res.status(400).send({
                        status: res.statusCode,
                        message: `Password Harus Lebih Dari 6 Karakter!`,
                    });
                }
            } else {
                return res.status(400).send({
                    status: res.statusCode,
                    message: `Email Sudah Pernah Terdaftar Sebagai Seller!`,
                });
            }
        } catch (error) {
            console.log(error);
            this.err.internalError(res);
        }
    }

    async signIn(req, res, next) {
        try {
            console.log(req.body);
            passport.authenticate(
                "local",
                { session: false },
                (err, user, info) => {
                    if (err || !user) {
                        console.log(err);
                        return res.status(400).json({
                            status: res.statusCode,
                            message: info.message,
                        });
                    }
                    req.login(user, { session: false }, async (err) => {
                        console.log(user);
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        let userData = user.toObject();
                        const token = jwt.sign(
                            { _id: userData._id },
                            process.env.jwt,
                            {
                                expiresIn: process.env.expiredJWT,
                            }
                        );
                        let data_toko = await this.toko.findTokobyUserId(
                            userData._id
                        );
                        let data = data_toko
                            ? { toko_id: data_toko.toko_id }
                            : null;
                        return res.status(200).send({
                            status: res.statusCode,
                            message: info.message,
                            token,
                            data,
                        });
                    });
                }
            )(req, res, next);
        } catch (error) {
            console.log(error);
            this.err.internalError(res);
        }
    }

    async logout(req, res, next) {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let token_object = jwt.verify(token, process.env.jwt);
            await client.set(`jwt_bl_${token}`, token);
            client.expireAt(`jwt_bl_${token}`, token_object.exp);
            return res.status(200).send({
                status: res.statusCode,
                message: `Logout Sukses, Token invalidated`,
            });
        } catch (error) {
            console.log(error);
            this.err.internalError(res);
        }
    }
}

export default AuthController;
