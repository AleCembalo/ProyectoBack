import usersModel from "../models/users.model.js";
import UsersService from "../dao/mongo/users.dao.mdb.js";

const service = new UsersService();

class UsersManager {
    constructor() { }

    getAll = async (limit = 0) => {
        try {
            return limit === 0
                ? await usersModel.find().lean()
                : await usersModel.find().limit(limit).lean();
        } catch (err) {
            return err.message;
        }
    };

    getById = async (id) => {
        try {
            return await usersModel.findById(id).lean();
        } catch (err) {
            return err.message;
        }
    };

    getOne = async (filter) => {
        try {
            return await usersModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        }
    };

    getAggregated = async (match, sort) => {
        try {
            return await service.getAggregatedService(match, sort);
        } catch (err) {
            return err.message;
        }
    };

    getPaginated = async (filter, options) => {
        try {
            return await service.getPaginatedService(filter, options);
        } catch (err) {
            return err.message;
        }
    };

    add = async (newData) => {
        try {
            return await service.addService(newData);
        } catch (err) {
            return err.message;
        }
    };

    update = async (filter, update, options) => {
        try {
            return await service.updateService(filter, update, options);
        } catch (err) {
            return err.message;
        }
    };

    delete = async (filter) => {
        try {
            return await service.deleteService(filter);
        } catch (err) {
            return err.message;
        }
    };
}

export default UsersManager;
