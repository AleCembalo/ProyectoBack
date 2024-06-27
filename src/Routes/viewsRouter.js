import { Router } from 'express';
import config from '../config.js';
import productsModel from '../dao/models/products.model.js';
import ProductsManager from '../dao/productManager.mdb.js';

const router = Router();
const manager = new ProductsManager();

router.get('/products', async (req, res) => {
    const products = await productsModel.find().lean();
    const user = req.user;
    res.render('home', { products: products, user: user });
});

router.get('/realtimeproducts/:page', async (req, res) => {

    const products = await manager.getAllReal(config.PRODUCTS_PER_PAGE, req.params.page);
    res.render('realtimeproducts', { products: products });
});

router.get('/chat', async (req, res) => {
    res.render('chat', { });
});

router.get('/register', (req, res) => {
    res.render('register', { msg: req.query.error });
});

router.get('/login', (req, res) => {
    if (req.user){ 
        res.redirect('/profile');
    }
    res.render('login', { showError: req.query.error ? true: false, errorMessage: req.query.error });
});

router.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('profile', { user: req.user });
});

export default router;