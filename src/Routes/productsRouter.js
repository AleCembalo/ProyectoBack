
import { Router } from 'express';
import config from '../Config/config.js';
import ProductManager from '../dao/productManager.mdb.js'


const productRouter = Router();
const manager = new ProductManager();

productRouter.get ('/:page/:limit/:sort/:query', async (req, res) => {

    const query = req.params.query;
    const limit = +req.params.limit;
    const page = +req.params.page;
    const sort = req.params.sort;

    try {
        const products = await manager.getAll( page, limit, sort, query);
        res.status(200).send({ origin: config.SERVER, payload: products });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
    
});

productRouter.get ('/:pid', async (req, res) => {

    try {
        const product = await manager.getById(req.params.pid);
        res.status(200).send({ origin: config.SERVER, payload: product });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

productRouter.post ('/', async (req, res) => {
    
    try {
        const socketServer = req.app.get('socketServer');
        const product = await manager.add(req.body);
        res.status(200).send({ origin: config.SERVER, payload: `se agrego ${product.title} correctamente`});
        socketServer.emit('newProduct', (req.body));
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

productRouter.delete('/:id', async (req, res) => {

    try {
        const filter = { _id: req.params.id };
        const product = await manager.delete(filter);
        res.status(200).send({ origin: config.SERVER, payload: `se borró ${product.title} correctamente`});

    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
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
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const product = await manager.update(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: product });

    }
});

export default productRouter;

