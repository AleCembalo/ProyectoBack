import cartsModel from '../models/carts.model.js';
import productsModel from '../models/products.model.js';
import usersModel from '../models/users.model.js'

class CartService {

    constructor() {}

    getAllService = async () => {
        try {
            return await cartsModel
            .find()
            .populate({ path: 'user_id', model: usersModel })
            .populate({ path: 'products.product', model: productsModel })
            .lean();
        } catch (err) {
            return err.message;
        };
    };

    addService = async (newData) => {
        try {
            return await cartsModel
            .populate({ path: 'user_id', model: usersModel })
            .populate({ path: 'products.product', model: productsModel })
            .create(newData);
        } catch (err) {
            return err.message;
        };
    };

    getByIdService = async (id) => {
        try {
            return await cartsModel.findById(id);
        } catch (err) {
            return err.message;
        };
    };

    updateService = async (filter, update, options) => {
        try {
            return await cartsModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    };

    deleteService = async (filter) => {
        try {
            return await cartsModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };

    addToCarService = async (idp, idc, quantity) => {
        try {
            let cart = await cartsModel.findById(idc);
            const product = await productsModel.findById(idp);
            quantity ? quantity : 1;
            
            const exist = cart.products.find(p => p.product.toHexString() === idp);
            console.log(exist.quantity);

            if ( exist ) {
                exist.quantity += quantity;
                console.log(exist.quantity);
                cart = await cartsModel.findByIdAndUpdate({ _id: idc, "products.product": exist.product }, { quantity: cart.products.exist.quantity}, { new: true })
            } else {
                cart.products.push({ product: product, quantity: 1});
                cart = await cartsModel.findByIdAndUpdate({_id: idc}, { products: cart.products}, { new: true })
            }

            return cart;
        } catch (err) {
            return err.message;
        }
    };

}

export default CartService;