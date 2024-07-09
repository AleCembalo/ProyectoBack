import CartService from '../services/carts.service.js';

const service = new CartService();

class CartManager {

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

    update = async (filter, update, options) => {
        try {
            return await service.updateService(filter, update, options);
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
    
    addToCart = async (idp, idc, quantity) => {
        try {
            return await service.addToCarService(idp, idc, quantity);
        } catch (err) {
            return err.message;
        }
    };
};

export default CartManager;
