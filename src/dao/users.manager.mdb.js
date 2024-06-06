import usersModel from './models/users.model.js';

class UsersManager {
    constructor() {
    }

    getAll = async (limit = 0) => {
        try {
            return limit === 0 ? await usersModel.find().lean(): await usersModel.find().limit(limit).lean();
        } catch (err) {
            return err.message;
        };
    };

    getById = async (id) => {
        try {
            return await usersModel.findById(id).lean();
        } catch (err) {
            return err.message;
        };
    };

    getAggregated = async (match, sort) => {
        try {
            return await usersModel.aggregate([
                { $match: match },
                { $sort: sort }
            ]);
        } catch (err) {
            return err.message;
        };
    };

    getPaginated = async (filter, options) => {
        try {
            return await usersModel.paginate({filter}, {options, lean: true});
        } catch (err) {
            return err.message;
        };
    };

    add = async (newData) => {
        try {
            return await usersModel.create(newData);
        } catch (err) {
            return err.message;
        };
    };

    update = async (filter, update, options) => {
        try {
            return await usersModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    };

    delete = async (filter) => {
        try {
            return await usersModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };
}

export default UsersManager;
