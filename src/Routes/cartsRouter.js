
import { Router } from 'express';
import config from '../Config/config.js';
import CartManager from '../dao/cartManager.mdb.js'
import ProductManager from '../dao/productManager.mdb.js';

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

cartsRouter.post ('/:pid/product/:cid', async (req, res) => {

    try {
        const filterCart = {_id: req.params.cid};
        const filterProduct = {_id: req.params.pid};
        return productToCart(filterProduct, filterCart);
        // console.log(process);
        // const cart = await manager.getById(filterCart);
        // const product = await managerP.getById(filterProduct);
        
        // let productExist = cart.products.find((p) => p.product === +pid) || {};
        // console.log(cart);

        // if (productExist) {
        //     const quantity = productExist.quantity || 1;
        //     cart.products[productExist].quantity++;
        // } else {
        //     cart.products.push({ product: product, quantity: 1});

        //     cart.products.push({
        //         product: product,
        //         quantity
        //     })
        // }
        
        res.status(200).send({ origin: config.SERVER, payload: 20});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});    
    
    // let cart = this.carts.find((c) => c.id === +cid); 
    // let product = cart.products.find((p) => p.id === +pid);
    // let exist = cart.products.find((p) => p.product === +pid) || {};

    // let quantity = exist.quantity || 1;
    // if (exist.product) {
        
    //     exist.quantity = quantity+1;
        
    // } else {
    //     cart.products.push({
    //         product: product.id,
    //         quantity
    //     });
    // }


export default cartsRouter;