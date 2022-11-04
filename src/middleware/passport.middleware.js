import { Strategy } from "passport-local";
import passportJWT from "passport-jwt";
import sign from "jwt-encode";

import { getHashedPassword } from "../../lib/crypto.js";
import Seller from "../../database/model/seller.model.js";
import Admin from "../../database/model/admin.model.js";
import { client } from "../../database/index.js";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export default function (passport) {
    passport.use(
        new Strategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, cb) => {
                console.log("ini di passport local", email, password);
                const hashed = getHashedPassword(password);
                return Seller.findOne({ email, password: hashed })
                    .then(async (user) => {
                        if (!user) {
                            const data = await Admin.findOne({
                                email,
                                password: hashed,
                            });
                            console.log(data);
                            if (data) {
                                return cb(null, data, {
                                    message: "Admin Logged In Successfully",
                                });
                            } else {
                                return cb(null, false, {
                                    message:
                                        "Incorrect Admin email or password.",
                                });
                            }
                        } else {
                            return cb(null, user, {
                                message: "Logged In Successfully",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        cb(err);
                    });
            }
        )
    );

    passport.use(
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.jwt,
            },
            async (jwtPayload, cb) => {
                const token = sign(jwtPayload, process.env.jwt);
                const inBlackList = await client.get(`jwt_bl_${token}`);

                return Seller.findOne({ _id: jwtPayload._id })
                    .then(async (user) => {
                        if (!user) {
                            if (inBlackList) {
                                return cb(null, false);
                            }
                            const data = await Admin.findOne({
                                _id: jwtPayload._id,
                            });
                            if (data) {
                                return cb(null, data);
                            } else {
                                return cb(null, false);
                            }
                        }
                        if (inBlackList) {
                            return cb(null, false);
                        }
                        return cb(null, user);
                    })
                    .catch((err) => {
                        console.log(err);
                        return cb(err);
                    });
            }
        )
    );

    // passport.serializeUser(function (user, done) {
    // 	done(null, user._id);
    // });

    // passport.deserializeUser(function (id, done) {
    // 	console.log(id);
    // 	Seller.findById(id, function (err, user) {
    // 		done(err, user);
    // 	});
    // });
}
