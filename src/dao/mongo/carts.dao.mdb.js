import cartsModel from '../../models/carts.model.js';
import productsModel from '../../models/products.model.js';
import ticketsModel from '../../models/tickets.model.js';
import ProductManager from '../../controllers/productManager.js';
import { generateCode } from '../../services/utils.js'

const manager = new ProductManager();

class CartService {

    constructor() {}

    getAllService = async () => {
        try {
            return await cartsModel
            .find()
            .populate({ path: 'products.product', model: productsModel })
            .lean();
        } catch (err) {
            return err.message;
        };
    };

    addService = async (newData) => {
        try {
            const newCart = cartsModel.create(newData);

            await cartsModel
            .findById(newCart._id)
            .populate({ path: 'products.product', model: productsModel })
            .lean();
            return newCart;
        } catch (err) {
            return err.message;
        };
    };

    getByIdService = async (id) => {
        try {
            return await cartsModel.findById(id);
        } catch (err) {
            return err.message;
        };
    };

    deleteService = async (filter) => {
        try {
            return await cartsModel.findOneAndDelete(filter);
        } catch (err) {
            return err.message;
        };
    };

    updateCartService = async (filter, products) => {
        try {
            const cart = await cartsModel.findById(filter);
            await cartsModel.updateOne(
                { _id: filter },
                { products: products },
                { new: true}
            );
            console.log(cart);
            cart.save();
        } catch (err) {
            return err.message;
        };
    };

    addToCartService = async (idp, idc, quantity) => {
        try {
            let cart = await cartsModel.findById(idc);
            const product = await productsModel.findById(idp);
            quantity ? quantity : 1;

            const exist = cart.products.find(p => p.product.toHexString() === idp);
            
            if ( exist ) {
                exist.quantity += quantity;
                await cart.save();
            } else {
                cart.products.push({ product: product, quantity: 1});
                await cart.save();
            }
            return cart;
        } catch (err) {
            return err.message;
        }
    };

    deleteToCartService = async (idp, idc, quantity) => {
        try {
            let cart = await cartsModel.findById(idc);
            const exist = cart.products.find(p => p.product._id.toHexString() === idp);
            quantity ? quantity : exist.quantity;

            if ( exist.quantity > 0 ) {
                exist.quantity = exist.quantity - 1;
                await cart.save();
            }else {
                cart.products.pull(exist);
                await cart.save();
            }
        } catch (error) {
            return err.message;
        }
    };

    deleteAllProductsService = async (filter) => {
        try {
            const cart = await cartsModel.findById(filter);
            await cartsModel.updateOne(
                { _id: filter },
                { products: [] },
                { new: true}
            );
            console.log(cart);
            cart.save();
        } catch (error) {
            return err.message;
        }
    };

    purchaseCartService = async (idc, user) => {
        try {
            const mailUser = user.email;
            
            const cart = await cartsModel
            .findById(idc)
            .populate({ path: 'products.product', model: productsModel })
            .lean();
    
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            const productsToUpdate = [];
            const productsToKeep = [];

            for (const item of cart.products) {
                const product = item.product;
                const quantityInCart = item.quantity;

                if (product.stock >= quantityInCart) {
                    product.stock -= quantityInCart;
                    productsToUpdate.push(product);
                } else {
                    productsToKeep.push(item);
                }
            }
            
            await Promise.all(productsToUpdate.map((product) => manager.update(product._id, product)));
            
            await cartsModel.updateOne(
                { _id: idc },
                { products: productsToKeep },
                { new: true});

            const totalProduct = [];

            for (const item of cart.products) {
                const product = item.product;
                const quantityInCart = item.quantity;

                const total = product.price * quantityInCart;
                totalProduct.push(total);
            }
            const totalAmount = totalProduct.reduce((total, product) => total + product, 0);
            
            const ticket = {
                code: generateCode(),
                purchase_datetime: new Date(),
                amount: totalAmount.toFixed(2),
                purchaser: mailUser,
            };

            const newTicket = await ticketsModel.create(ticket);
            await ticketsModel
            .findById(newTicket._id)
            .lean();

            const productsNotPurchased = productsToKeep.map(item => item.product);

            return res.status(200).json({
                message: "Compra exitosa",
                ticket: newTicket,
                productsNotPurchased: productsNotPurchased,
            });
        } catch (error) {
            return err.message;
        }
    };
}

export default CartService;
