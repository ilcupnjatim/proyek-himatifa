import adminModel from "../../database/model/admin.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import TokoDB from "../../database/db/toko.db.js";

dotenv.config();

class _auth {
    constructor() {
        this.toko = new TokoDB();
    }

    loginAdmin = async (req, res, next) => {
        try {
            passport.authenticate(
                "local",
                { session: false },
                (err, admin, info) => {
                    if (err || !admin) {
                        console.log(err);
                        return res.status(400).json({
                            status: res.statusCode,
                            message: info.message,
                        });
                    }
                    req.login(admin, { session: false }, async (err) => {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }
                        let adminData = admin.toObject();
                        const token = jwt.sign(
                            { _id: adminData._id },
                            process.env.jwt,
                            {
                                expiresIn: process.env.expiredJWT,
                            }
                        );
                        let data_toko = await this.toko.findTokobyUserId(
                            adminData._id
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
            res.status(500).json({
                status: res.statusCode,
                message: error,
            });
        }
    };

    logoutAdmin = async (req, res, next) => {
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
    };
}

export default new _auth();
