import bcrypt from "bcryptjs";
import adminModel from "../../database/model/admin.model.js";
import { getHashedPassword } from "../../lib/crypto.js";

class _admin {
    addAdmin = async (req, res) => {
        try {
            const hash_password = getHashedPassword(req.body.password);

            const admin = new adminModel({
                email: req.body.email,
                password: hash_password,
            });
            admin.save((err, docs) => {
                if (!err) {
                    res.status(200).json({
                        status: res.statusCode,
                        message: `success add data admin`,
                        data: docs,
                    });
                } else {
                    res.status(404).json({
                        status: res.statusCode,
                        message: `error add data admin`,
                    });
                }
            });
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    getAdmin = async (req, res) => {
        const id = req.user._id;
        console.log(id);
        try {
            adminModel.findOne({ _id: id }, (err, docs) => {
                res.status(200).json({
                    status: res.statusCode,
                    message: `success get data admin`,
                    data: docs,
                });
            });
        } catch (error) {
            res.status(404).json({
                status: res.statusCode,
                message: `error get data admin`,
            });
        }
    };
}

export default new _admin();
