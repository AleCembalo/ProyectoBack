import CustomRouter from './custom.router.js';
import config from '../config.js';
import { handlePolicies } from '../services/utils.js'
import productsModel from '../models/products.model.js';
import ProductsManager from '../controllers/productManager.js';

const manager = new ProductsManager();

export default class ViewsRouter extends CustomRouter {
    
    init () {

        this.get('/cart', async (req, res) => {
            if (!req.session.user) return res.redirect('/login');
            const products = await productsModel.find().lean();
            const user = req.session.user;
            res.render('cart', { products: products, user: user });
        });
        
        this.get('/products', async (req, res) => {
            const products = await productsModel.find().lean();
            const user = req.session.user;
            res.render('home', { products: products, user: user });
        });
        
        this.get('/realtimeproducts/:page', async (req, res) => {
        
            const products = await manager.getAllReal(config.PRODUCTS_PER_PAGE, req.params.page);
            res.render('realtimeproducts', { products: products });
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
    }
}