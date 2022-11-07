import TransactionDB from "../../../database/db/transaction.db.js";
import ErrorHandler from "../../middleware/errHandler.middleware.js";

class TransactionController extends TransactionDB {
    constructor() {
        super();
        this.err = new ErrorHandler();
    }

    getTransaction = async (req, res, next) => {
        try {
            const { _id } = req.body;
            if (!_id) {
                return this.err.badRequest(res);
            }
            let data = await this.getDataTransaction(_id);
            if (data) {
                return res.status(200).send({
                    status: res.statusCode,
                    message: `Sukses GET Transaction id : ${data._id}`,
                    data,
                });
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    message: "Data Transaksi Tidak Ditemukan",
                });
            }
        } catch (error) {
            console.log(error);
            return this.err.internalError(res);
        }
    };
}

export default TransactionController;
