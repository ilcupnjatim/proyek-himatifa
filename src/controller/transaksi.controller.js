import transaksiModel from "../../database/model/transaksi.model.js";

class _transaksi {
    addTransaksi = async (req, res) => {
        try {
            const transaksi = new transaksiModel({
                name: req.body.name,
                address: req.body.address,
                contact: Number(req.body.contact),
                status: req.body.status,
                wishlist: req.body.wishlist,
            });
            transaksi.save((err, docs) => {
                if (!err) {
                    res.status(200).json(docs);
                } else {
                    res.status(404).json({ msg: "error" });
                }
            });
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    readTransaksi = async (req, res) => {
        try {
            transaksiModel.find({}, (err, docs) => {
                res.status(200).json(docs);
            });
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    updateTransaksi = async (req, res) => {
        const transaksi = {
            status: req.body.status,
        };
        const id = req.body.id;
        try {
            transaksiModel.findOneAndUpdate(
                { id },
                { $set: transaksi },
                { new: true },
                (err, docs) => {
                    res.status(200).json({
                        code: 200,
                        message: "Updated succesfully",
                        data: docs,
                    });
                }
            );
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };

    deleteTransaksi = async (req, res) => {
        try {
            transaksiModel.findByIdAndRemove(req.params._id, (err, docs) => {
                if (!err) {
                    res.status(200).json({
                        code: 200,
                        message: "Deleted succesfully",
                        data: docs,
                    });
                } else {
                    res.status(404).json({ msg: "Error Deleted" });
                }
            });
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    };
}

export default new _transaksi();
