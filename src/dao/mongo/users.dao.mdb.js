import usersModel from '../../models/users.model.js';
import cartsModel from '../../models/carts.model.js';
import CartService from '../mongo/carts.dao.mdb.js';

const service = new CartService();

class UsersService {

    constructor() {}

    getAggregatedService = async (match, sort) => {
        try {
            return await usersModel.aggregate([
                { $match: match },
                { $sort: sort }
            ]);
        } catch (err) {
            return err.message;
        };
    };

    getPaginatedService = async (filter, options) => {
        try {
            return await usersModel.paginate({filter}, {options, lean: true});
        } catch (err) {
            return err.message;
        };
    };

    addService = async (newData) => {
        try {
            const newUser = await usersModel.create(newData);
            await usersModel
            .findById(newUser._id)
            .populate({ path: 'cartId', model: cartsModel })
            .lean();
            return newUser
        } catch (err) {
            return err.message;
        };
    };

    updateService = async (filter, update, options) => {
        try {
            // const normalized = new usersDTO(update);
            return await usersModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    };

    deleteService = async (filter) => {
        try {
            return await usersModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };
}

export default UsersService;