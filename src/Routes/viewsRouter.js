import { Router } from 'express';
// import fs from 'fs';
// import path from 'path';
import config from '../config.js';
import productsModel from '../dao/models/products.model.js';
import ProductsManager from '../dao/productManager.mdb.js';

const viewsRouter = Router();
const manager = new ProductsManager();


// const urlProd = path.join(config.DIRNAME, '/Data/products.json');
// const data = await fs.promises.readFile(urlProd, 'utf-8');
// const products = await JSON.parse(data);


viewsRouter.get('/products', async (req, res) => {
    const products = await productsModel.find().lean();
    const user = req.session.user;
    res.render('home', { products: products, user: user });
});

viewsRouter.get('/realtimeproducts/:page', async (req, res) => {

    const products = await manager.getAllReal(config.PRODUCTS_PER_PAGE, req.params.page);
    res.render('realtimeproducts', { products: products });
});

viewsRouter.get('/chat', async (req, res) => {
    res.render('chat', { });
});

viewsRouter.get('/register', (req, res) => {
    res.render('register', { msg: req.query.error });
});

viewsRouter.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/profile');
    res.render('login', { showError: req.query.error ? true: false, errorMessage: req.query.error });
});

viewsRouter.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('profile', { user: req.session.user });
});

export default viewsRouter;

