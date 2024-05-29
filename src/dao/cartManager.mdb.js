import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';

class CartManager {
    constructor() {
    }

    getAll = async () => {
        try {
            return await cartsModel
            .find()
            .populate({ path: 'products._id', model: productsModel })
            .lean();
        } catch (err) {
            return err.message;
        };
    };

    add = async (newData) => {
        try {
            return await cartsModel.create(newData);
        } catch (err) {
            return err.message;
        };
    };

    getById = async (id) => {
        try {
            return await cartsModel.findById(id);
        } catch (err) {
            return err.message;
        };
    };

    update = async (filter, update, options) => {
        try {
            return await cartsModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    };

    delete = async (filter) => {
        try {
            return await cartsModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };

    productToCart = async (idp, idc) => {
        try {
            const cart = await cartsModel.findById(idc);
            const product = await productsModel.findById(idp);
            cart.push(product);
        } catch (err) {
            return err.message;
        }
    };
}    

export default CartManager;
