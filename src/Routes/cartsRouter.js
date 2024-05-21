
import { Router } from 'express';
import CartManager from '../Manager/cartManager.js';
import cartsModel from '../dao/models/carts.model.js';

const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.post ('/', async (req, res) => {

    await cartManager.createCart();
    res.status(200).send ({status: 1, payload: `se agrego el carrito Id:  ${req.body.id} correctamente`})
});

cartsRouter.get ('/:cid', async (req, res) => {

    const cartId = await cartManager.getCartById(req.params.cid);
    res.status(200).send ({status: 1, payload: cartId.products})
});

cartsRouter.post ('/:cid/product/:pid', async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;
    await cartManager.productToCar(pid,cid);
    
    res.status(200).send ({status: 1, payload: `se agrego el producto id: ${pid} al carrito id: ${cid}`})

});
export default cartsRouter;