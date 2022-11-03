import adminModel from "../../database/model/admin.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

class _auth {
    loginAdmin = async (req, res) => {
        const { username, password } = req.body;
        try {
            adminModel.findOne({ username }, (err, docs) => {
                const match = bcrypt.compareSync(password, docs.password);
                if (match === true) {
                    const admin = {
                        _id: docs._id,
                        username: username,
                        password: docs.password,
                    };
                    const accessToken = jwt.sign(
                        admin,
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    res.status(200).json({
                        status: res.statusCode,
                        message: `login success`,
                        data: admin,
                        token: accessToken,
                    });
                } else {
                    res.status(404).json({
                        status: res.statusCode,
                        message: `login failed`,
                    });
                }
            });
        } catch (error) {
            res.status(500).json({
                status: res.statusCode,
                message: error,
            });
        }
    };
}

export default new _auth();
