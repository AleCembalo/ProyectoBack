import CustomRouter from './custom.router.js';
import ProductManager from '../dao/productManager.mdb.js';
import config from '../config.js';
import { uploader } from '../uploader.js';

const manager = new ProductManager();

export default class ProductsRouter extends CustomRouter {
    
    init () {

        this.get('/:id', async(req, res) => {

            try {
                if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                    res.sendUserError( 'Id no válido' );
                }
                const product = await manager.getById(req.params.id);
                res.sendSuccess( product );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.get ('/:page/:limit/:sort/:query', async (req, res) => {

            const query = req.params.query;
            const limit = +req.params.limit;
            const page = +req.params.page;
            const sort = req.params.sort;
        
            try {
                const products = await manager.getAll( page, limit, sort, query);
                res.sendSuccess( products );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.post ('/', uploader.single('thumbnails'), async (req, res) => {

            const { title, description, price, code, stock, category } = req.body;
            const thumbnails = req.file ? req.file.filename : [];
        
            if (!req.file) 
                res.sendUserError( 'Se requiere archivo img' );
            
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
            
                res.sendSuccess( `se agrego ${product.title} correctamente` );
                socketServer.emit('newProduct', (req.body));

            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.delete('/:id', async (req, res) => {

            try {

                if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                    res.sendUserError( 'Id no válido' );
                }
                const filter = { _id: req.params.id };
                const product = await manager.delete(filter);
                res.sendSuccess( `se borró ${product.title} correctamente` );
        
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.put('/:id', uploader.single('thumbnails'), async (req, res) => {
            const { id } = req.params;
            const nid = +id;

            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                res.sendUserError( 'Id no válido' );
            }
            if (nid <= 0 || isNaN(nid)) {
                res.sendUserError( 'Se requiere id numérico mayor a 0' );
            } else if (req.body.hasOwnProperty('id')) {
                res.sendUserError( 'No se puede modificar el id' );
            } else {
                const filter = { _id: req.params.id };
                const update = req.body;
                const options = { new: true };
                const product = await manager.update(filter, update, options);
                
                res.sendSuccess( product );
            }
        });
    }
}
