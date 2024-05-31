
import { Router } from 'express';
import config from '../Config/config.js';
import CartManager from '../dao/cartManager.mdb.js'

const cartsRouter = Router();
const manager = new CartManager();

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await manager.getAll();
        res.status(200).send({ origin: config.SERVER, payload: carts });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

cartsRouter.post ('/', async (req, res) => {

    try {
        const cart = await manager.add(req.body);
        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

cartsRouter.put('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const cart = await manager.update(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

cartsRouter.delete('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const cart = await manager.delete(filter);

        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

cartsRouter.delete('/:cid/products/pid', async (req, res) => {

});

cartsRouter.put ('/:pid/products/:cid', async (req, res) => {

    try {
        const filterCart = req.params.cid;
        const filterProduct = req.params.pid;
        const quantity = req.body.quantity || 1;

        const cart = await manager.productToCart(filterProduct, filterCart, quantity);        
        
        res.status(200).send({ origin: config.SERVER, payload: cart});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});    

export default cartsRouter;