import CustomRouter from './custom.router.js';
import config from '../config.js';
import { handlePolicies, verifyToken } from '../services/utils.js';
import productsModel from '../models/products.model.js';
import cartsModel from '../models/carts.model.js'
import ProductsManager from '../controllers/productManager.js';

const manager = new ProductsManager();

export default class ViewsRouter extends CustomRouter {
    
    init () {

        this.get('/cart', async (req, res) => {
            if (!req.session.user) return res.redirect('/login');
            const products = await productsModel.find().lean();
            const user = req.session.user;
            const cart = await cartsModel
            .findById(user.cartId)
            .populate({ path: 'products.product', model: productsModel })
            .lean();
            
            cart.products = cart.products.map(product => {
                return {
                    ...product,
                    subtotal: product.product.price * product.quantity
                };
            });
            cart.total = cart.products.reduce((acc, product) => acc + product.subtotal, 0).toFixed(2);
            res.render('cart', { products: products, user: user, cart: cart });
        });
        
        this.get('/products', async (req, res) => {
            const products = await productsModel.find().lean();
            const user = req.session.user;
            
            res.render('home', { products: products, user: user });
        });

        this.get('/products/:category', async (req, res) => {

            if (req.params.category === 'herramientas' || req.params.category === 'electricidad' || req.params.category === 'fontaneria') {

                const match = { category: req.params.category };
                const sort = { price: 1 };
                const products = await manager.getAggregated(match, sort);

                res.render('category', { products: products });
            } else {
                res.sendUserError( 'role: solo se acepta admin, premium o user' );
            }
        });        
        
        this.get('/realtimeproducts/:page', async (req, res) => {
            const user = req.session.user;
            const products = await manager.getAllReal(config.PRODUCTS_PER_PAGE, req.params.page);
            
            res.render('realtimeproducts', { products: products, user: user });
        });
        
        this.get('/chat', handlePolicies (['user']), async (req, res) => {
            res.render('chat', { });
        });
        
        this.get('/register', (req, res) => {
            res.render('register', { msg: req.query.error });
        });
        
        this.get('/login', (req, res) => {
            if (req.session.user){
                res.redirect('/profile');
            }
            res.render('login', { showError: req.query.error ? true: false, errorMessage: req.query.error });
        });
        
        this.get('/profile', (req, res) => {
            if (!req.session.user) return res.redirect('/login');
            res.render('profile', { user: req.session.user });
        });

        this.get('/restore', (req, res) => {
            res.render('restore', { });
        });

        this.get('/restorepassword', verifyToken, (req, res) => {
            const user = req.user;
            if (!req.user) return res.redirect('/restore');
            res.render('restorepassword', { user: user });
        });

        this.get('/uploaddocuments', (req, res) => {
            if (!req.session.user) return res.redirect('/login');
            res.render('uploaddocuments', { user: req.session.user });
        });

        this.get('/uploadproductsimages', (req, res) => {
            res.render('uploadproductsimages', { });
        });

        this.get('/uploadprofilesimages', (req, res) => {
            res.render('uploadprofilesimages', { });
        });
    }
}