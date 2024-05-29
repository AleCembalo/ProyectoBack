import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import config from '../Config/config.js';
import productsModel from '../dao/models/products.model.js';

const viewsRouter = Router();

// const urlProd = path.join(config.DIRNAME, '/Data/products.json');
// const data = await fs.promises.readFile(urlProd, 'utf-8');
// const products = await JSON.parse(data);


viewsRouter.get('/products', async (req, res) => {
    const products = await productsModel.find().lean();
    res.render('home', { products: products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {

    const products = await productsModel.find().lean();
    res.render('realtimeproducts', { products: products });
});

viewsRouter.get('/chat', async (req, res) => {
    res.render('chat', { });
});



export default viewsRouter;

