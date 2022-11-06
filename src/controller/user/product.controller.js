import ProductDB from "../../../database/db/product.db.js";
import ErrorHandler from "../../middleware/errHandler.middleware.js";

class ProductUser extends ProductDB {
	constructor() {
		super();
		this.err = new ErrorHandler();
	}

	async getAllProduct(req, res, next) {
		try {
			const { category } = req.query;
			if (category) {
				var array = await this.findAllProductCategory(category);
			} else {
				var array = await this.getAllProductDB();
			}
			if (array) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Get All Product`,
					data: array,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Data Product Not Found",
				});
			}
		} catch (error) {
			console.log(error);
			return this.err.internalError(res);
		}
	}
}

export default ProductUser;
