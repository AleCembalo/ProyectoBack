import usersModel from '../../models/users.model.js';
import cartsModel from '../../models/carts.model.js';

class UsersService {

    constructor() {}

    getService = async () => {
        try {
            return await usersModel.find().lean();
        } catch (err) {
            return err.message;
        }
    };

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

    getByIdService = async (id) => {
        try {
            return await usersModel.findById(id).lean();
        } catch (err) {
            return err.message;
        }
    };

    getOneService = async (filter) => {
        try {
            return await usersModel.findOne(filter).lean();
        } catch (err) {
            return err.message;
        }
    };

    addService = async (newData) => {
        try {
            const newUser = await usersModel.create(newData);
            await usersModel
            .findById(newUser._id)
            .populate({ path: 'cartId', model: cartsModel })
            .lean();
            
            return newUser;
        } catch (err) {
            return err.message;
        };
    };

    updateService = async (filter, update, options) => {
        try {
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

    uploadDocumentsService = async (uid, documents) => {
        try {
            const user = await usersModel.findById(uid);
            if (!user) {
                res.sendUserError('No se encontró el usuario');
            }
    
            user.documents = user.documents || [];
    
            documents.forEach(doc => {
                user.documents.push({
                    name: doc.originalname,
                    reference: doc.path 
                });
            });
    
            const updatedUser = await user.save();
            res.sendSuccess(updatedUser);
        } catch (err) {
            return err.message;
        };
    };
}

export default UsersService;