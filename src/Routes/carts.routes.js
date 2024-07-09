import CustomRouter from './custom.router.js';
import config from '../config.js';
import CartManager from '../controllers/cartManager.mdb.js'

const manager = new CartManager();

export default class CartsRouter extends CustomRouter {
    
    init () {
        
        this.get('/', async (req, res) => {
            try {
                const carts = await manager.getAll();
                res.sendSuccess( carts );
            } catch (err) {
                res.sendServerError(  'error');
            }
        });
        
        this.post('/', async (req, res) => {
            try {
                const cart = await manager.add(req.body);
                res.sendSuccess( cart );
            } catch (err) {
                res.sendServerError('error');
            }
        });
        
        this.put('/:id', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                return res.sendUserError( 'Id no válido' );
            }
            try {
                const filter = {
                    _id: req.params.id
                };
                const update = req.body;
                const options = {
                    new: true
                };
                const cart = await manager.update(filter, update, options);
        
                res.sendSuccess( cart );
            } catch (err) {
                res.sendServerError(  'error');
            }
        });
        
        this.delete('/:id', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                return res.sendUserError( 'Id no válido' );
            }
            try {
                const filter = {
                    _id: req.params.id
                };
                const cart = await manager.delete(filter);
        
                res.sendSuccess( cart );
            } catch (err) {
                res.sendServerError(  'error');
            }
        });
        
        this.delete('/:cid/products/pid', async (req, res) => {
        
            if (!config.MONGODB_ID_REGEX.test(req.params.pid)) {
                return res.sendUserError( 'Id no válido' );
            }

            if (!config.MONGODB_ID_REGEX.test(req.params.cid)) {
                return res.sendUserError( 'Id no válido' );
            }

            try {

                const filterCart = req.params.cid;
                const filterProduct = req.params.pid;
        
                const cart = await manager.addToCart(filterProduct, filterCart);

                res.sendSuccess( cart );
            }
            catch (err) {
                res.sendServerError( 'error');
            }
        });
        
        this.put('/:pid/products/:cid', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.pid)) {
                return res.sendUserError( 'Id no válido' );
            }

            if (!config.MONGODB_ID_REGEX.test(req.params.cid)) {
                return res.sendUserError( 'Id no válido' );
            }
        
            try {
                const filterCart = req.params.cid;
                const filterProduct = req.params.pid;
                const quantity = req.body.quantity || 1;
                
                const cart = await manager.addToCart(filterProduct, filterCart, quantity);
                
                res.sendSuccess( cart );
            } catch (err) {
                res.sendServerError( 'error');
            }
        });
    }
}