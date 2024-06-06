
import productsModel from '../dao/models/products.model.js';

class ProductManager {

    constructor() {}

    getAll = async (req) => {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const category = req.query.category ? req.query.category : null;
        let sort = req.query.sort;
        
        try {
            const order = sort === 'asc' ? 1 : -1;
            const options = {
                page,
                limit,
                sort: { price: order },
            };
            return await productsModel.paginate({category}, {options, lean: true});
        
        } catch (err) {
            return err.message;
        }
    };

    getAllReal = async (limit = 0, page = 1) => {
        try {
            if (limit === 0) {
                return await productsModel.find().lean();
            } else {
                return await productsModel.paginate({}, { page: page, limit: limit, lean: true });
            }
        } catch (err) {
            return err.message;
        };
    };

    add = async (newData) => {
        try {
            return await productsModel.create(newData);
        } catch (err) {
            return err.message;
        };
    };

    getById = async (id) => {
        try {
            return await productsModel.findById(id).lean();
        } catch (err) {
            return err.message;
        };
    };

    update = async (filter, update, options) => {
        try {
            return await productsModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    };

    delete = async (filter) => {
        try {
            return await productsModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };
}

export default ProductManager;
