
import productsModel from '../models/products.model.js'
import ProductService from '../dao/mongo/products.dao.mdb.js';
// import ProductService from '../dao/fs/products.dao.fs.js';

const service = new ProductService();

class ProductManager {

    constructor() {}

    getAll = async (category, page, limit, sort) => {
        
        try {
            const order = sort === 'asc' ? 1 : -1;
            const options = {
                page,
                limit,
                sort: { price: order },
            };
            return await service.getAllService ({category}, {options})
        } catch (err) {
            return err.message;
        }
    };

    getAllReal = async (limit = 0, page = 1) => {
        try {
            if (limit === 0) {
                return await productsModel.find().lean();
            } else {
                return await productsModel.paginate({}, { page: page, limit: limit, lean: true });
            }
        } catch (err) {
            return err.message;
        };
    };

    add = async (newData) => {
        try {
            const normalized = new ProductsDTO(newData);
            return await service.addService(normalized.newData);
        } catch (err) {
            return err.message;
        };
    };

    getById = async (id) => {
        try {
            return await service.getByIdService(id);
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
}

export default ProductManager;
