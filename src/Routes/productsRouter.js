
import { Router } from 'express';
import ProductManager from '../Manager/productManager.js';
import productsModel from '../dao/models/products.model.js';

const productRouter = Router();
const productManager = new ProductManager();

productRouter.get ('/', async (req, res) => {
    
    const products = await productsModel.find();
    // const limit = +req.query.limit || 0;
    // const products = await productManager.getProducts(limit);

    res.status(200).send ({status: 1, payload: products})
});

productRouter.get ('/:pid', async (req, res) => {
    // const product = await productManager.getProductById(req.params.pid);
    const product = await productsModel.findById(req.params.pid);

    res.status(200).send ({status: 1, payload: product})
});

productRouter.post ('/', async (req, res) => {
    
    const socketServer = req.app.get('socketServer');
    const product = await productManager.addProduct(req.body);
    console.log(product);

    res.status(200).send ({status: 1, payload: `se agrego ${req.body.title} correctamente`})
    socketServer.emit('newProduct', product);
});

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const nid = +id; 

    if (nid <= 0 || isNaN(nid)) {
        res.status(400).send({ status: 0, payload: [], error: 'Se requiere id numérico mayor a 0' });
    } else {      
        await productManager.deleteById(nid)
        res.status(200).send({ status: 1, payload: `Se borro el id ${nid}` });
    }
});

productRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const nid = +id;

    if (nid <= 0 || isNaN(nid)) {
        res.status(400).send({ origin: 'server1', payload: [], error: 'Se requiere id numérico mayor a 0' });
    } else if (req.body.hasOwnProperty('id')) {
        res.status(401).send({ origin: 'server1', payload: [], error: 'No se puede modificar el id' });
    } else {
        await productManager.updated(nid, req.body)
        res.status(200).send({ origin: 'server1', payload: `Quiere modificar el id ${id} con el contenido del body`});

    }
});

export default productRouter;

