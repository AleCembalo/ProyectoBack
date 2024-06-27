
import { Router } from 'express';
import { uploader } from '../uploader.js';
import config from '../config.js';
import ProductManager from '../dao/productManager.mdb.js'

const router = Router();
const manager = new ProductManager();

router.get ('/:page/:limit/:sort/:query', async (req, res) => {

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

router.get ('/:id', async (req, res) => {
    try {
        const product = await manager.getById(req.params.id);
        res.status(200).send({ origin: config.SERVER, payload: product });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post ('/', uploader.single('thumbnails'), async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    const thumbnails = req.file ? req.file.filename : [];

    if (!req.file) {
        res.status(400).send({ origin: 'server1', payload: [], error: 'Se requiere archivo img' });
    }
    try {
        const socketServer = req.app.get('socketServer');
        console.log(req.file);
        const newProduct = {
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnails: thumbnails || []
        };
        const product = await manager.add(newProduct);
    
        res.status(200).send({ origin: config.SERVER, payload: `se agrego ${product.title} correctamente`});
        socketServer.emit('newProduct', (req.body));
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const filter = { _id: req.params.id };
        const product = await manager.delete(filter);
        res.status(200).send({ origin: config.SERVER, payload: `se borró ${product.title} correctamente`});

    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }

});

router.put('/:id', uploader.single('thumbnail'), async (req, res) => {
    const { id } = req.params;
    const nid = +id;

    if (nid <= 0 || isNaN(nid)) {
        res.status(400).send({ origin: 'server1', payload: [], error: 'Se requiere id numérico mayor a 0' });
    } else if (req.body.hasOwnProperty('id')) {
        res.status(401).send({ origin: 'server1', payload: [], error: 'No se puede modificar el id' });
    } else {
        console.log(req.file);
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const product = await manager.update(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: product });
    }
});

export default router;

