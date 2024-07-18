// import CartService from '../dao/fs/carts.dao.fs.js';
import CartService from "../dao/mongo/carts.dao.mdb.js";

const service = new CartService();

class CartManager {
    constructor() {}

    getAll = async () => {
        try {
            return await service.getAllService();
        } catch (err) {
            return err.message;
        };
    };

    add = async (newData) => {
        try {
            return await service.addService(newData);
        } catch (err) {
            return err.message;
        };
    };

    getById = async (id) => {
        try {
            return await service.getByIdService(id)
        } catch (err) {
            return err.message;
        };
    };

    delete = async (filter) => {
        try {
            return await service.deleteService(filter);
        } catch (err) {
            return err.message;
        };
    };

    updateCart = async (filter) => {
        try {
            return await service.updateCartService(filter);
        } catch (err) {
            return err.message;
        };
    };

    addToCart = async (idp, idc, quantity) => {
        try {
            return await service.addToCartService(idp, idc, quantity);
        } catch (err) {
            return err.message;
        }
    };

    deleteToCart = async (idp, idc, quantity) => {
        try {
            return await service.deleteToCartService(idp, idc, quantity);
        } catch (err) {
            return err.message;
        }
    };

    deleteAllProducts = async (filter) => {
        try {
            return await service.deleteAllProductsService(filter);
        } catch (err) {
            return err.message;
        }
    };

    purchaseCart = async (idc) => {
        try {
            return await service.purchaseCartService(idc);
        } catch (err) {
            return err.message;
        }
    };
};

export default CartManager;
