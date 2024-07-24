import productsModel from '../../models/products.model.js';

class ProductService {

    constructor() {}

    getByIdService = async (id) => {
        try {
            return await productsModel.findById(id).lean();
        } catch (err) {
            return err.message;
        };
    };

    getAllService = async ({category},{options}) => {

        return productsModel.paginate({category}, {options, lean: true});
        
    };

    addService = async (newData) => {
        try {
            const newProduct  = await productsModel.create(newData);

            await productsModel
            .findById(newProduct._id)
            .lean();
            return newProduct;
        } catch (err) {
            return err.message;
        };
    };

    deleteService = async (filter) => {
        try {
            return await productsModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };

    updateService = async (filter, update, options) => {
        try {
            return await productsModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    };
}

export default ProductService;
