import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import config from '../Config/config.js';
import ProductManager from '../Manager/productManager.js';

const viewsRouter = Router();
const productManager = new ProductManager();

const urlProd = path.join(config.DIRNAME, '/Data/products.json');
const data = await fs.promises.readFile(urlProd, 'utf-8');
const products = await JSON.parse(data);


viewsRouter.get('/products', async (req, res) => {
    res.render('home', { products: products });
});

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.render('home', { title: 'Home', products: products });

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

viewsRouter.post('/realtimeproducts', async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);

        const updatedProducts = await productManager.getProducts();
        io.emit('newProduct', updatedProducts) 

        res.status(200).json({ status: 'success', message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default viewsRouter;

