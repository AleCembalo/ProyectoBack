import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';

class CartManager {

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

    updateQuantity = async (idCart, idProduct, quantity ) => {
        try {
            let cart = await cartsModel.findById(idCart);
            const exist = cart.products.findIndex(p => p.product.toString() === idProduct);

            if (exist > -1) {
                cart.products[exist].quantity = quantity;
            }
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
    

    productToCart = async (idp, idc, quantity) => {
        try {
            let cart = await cartsModel.findById(idc);
            const product = await productsModel.findById(idp);
            const exist = cart.products.findIndex(p => p.product.toString() === idp) || {};

            if (exist > -1) {
                cart.products[exist].quantity += quantity;
            } else {
                cart.products.push({ product: product, quantity: 1});
                cart = await cartsModel.findByIdAndUpdate(idc, { products: cart.products}, { new: true }).populate({ path: 'products._id', model: productsModel })
            }
            return cart;
        } catch (err) {
            return err.message;
        }
    };

    // productOutCart = async (idp, idc, quantity) => {
    //     try {
    //         let cart = await cartsModel.findById(idc);
    //         // const product = await productsModel.findById(idp);
    //         const productOut = cart.products.find(p => p.product.toString() === idp) ;

    //         if (exist > -1) {
    //             cart.products[exist].quantity += quantity;
    //         } else {
    //             cart.products.push({ product: product, quantity: 1});
    //             cart = await cartsModel.findByIdAndUpdate(idc, { products: cart.products}, { new: true }).populate({ path: 'products._id', model: productsModel })
    //         }
    //         return cart;
    //     } catch (err) {
    //         return err.message;
    //     }
    // };
}    

export default CartManager;
