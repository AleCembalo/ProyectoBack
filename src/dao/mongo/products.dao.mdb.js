import productsModel from '../../models/products.model.js';
import usersModel from '../../models/users.model.js';
import config from '../../config.js';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
    user: config.GMAIL_APP_USER,
    pass: config.GMAIL_APP_PASS
    }
});

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

    getAggregatedService = async (match, sort) => {
        try {
            return await productsModel.aggregate([
                { $match: match },
                { $sort: sort }
            ]);
        } catch (err) {
            return err.message;
        };
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

    deleteService = async (filter, user) => {
        try {
            const product = await productsModel
            .findById(filter)
            .populate({ path: 'owner', model: usersModel })
            .lean();

            const userAdmin = user;
            const userPremium = product.owner;
            const mailUser = userPremium.email;
            
            await productsModel.findOneAndDelete(product);

            if (userPremium.role === 'premium') {
                await transport.sendMail({
                    from: `Sistema Chemba <${config.GMAIL_APP_USER}>`,
                    to: `${mailUser}`,
                    subject: 'Pruebas Nodemailer',
                    html: `<div>
                                <h2>Hola ${userPremium.firstName}</h2>
                                <h3>Tu producto ${product.title}, ha sido borrado por el Admin: ${userAdmin.firstName}, ${userAdmin.lastName}</h3>
                            </div>`
                });
            };
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
