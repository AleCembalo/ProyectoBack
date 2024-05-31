
import productsModel from '../dao/models/products.model.js';

class ProductManager {

    constructor() {
    }

    getAll = async (category, limit, page) => {

        try {
            return await productsModel.paginate({category},{limit, page});
        } catch (err) {
            return err.message;
        }
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
