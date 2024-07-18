import CustomRouter from './custom.router.js';
import config from '../config.js';
import { handlePolicies, verifySession, generateCode } from "../services/utils.js";
import CartManager from '../controllers/cartManager.js'

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

        this.post('/:cid/purchase', async (req, res) => {
            if (!config.MONGODB_ID_REGEX.test(req.params.cid)) {
                return res.sendUserError( 'Id no válido' );
            }
            try {
                const filter = req.params.cid;
                await manager.purchaseCart(filter);
                res.sendSuccess(filter);
            } catch (err) {
                res.sendServerError('error');
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

        this.put('/:id', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                return res.sendUserError( 'Id no válido' );
            }
            try {
                const filter = req.params.id;
                
                await manager.deleteAllProducts(filter);
                res.sendSuccess( `se vació el carrito id: ${filter}`);
            } catch (err) {
                res.sendServerError(  'error');
            }
        });
        
        this.delete('/:cid/products/:pid', verifySession, handlePolicies (['user']), async (req, res) => {
        
            if (!config.MONGODB_ID_REGEX.test(req.params.pid)) {
                return res.sendUserError( 'Id no válido' );
            }

            if (!config.MONGODB_ID_REGEX.test(req.params.cid)) {
                return res.sendUserError( 'Id no válido' );
            }

            try {
                
                const filterCart = req.params.cid;
                const filterProduct = req.params.pid;
                const quantity = req.body.quantity;

                await manager.deleteToCart(filterProduct, filterCart, quantity);
                
                res.sendSuccess(filterCart);
            }
            catch (err) {
                res.sendServerError( 'error');
            }
        });
        
        this.put('/:pid/products/:cid', verifySession, handlePolicies (['self']), async (req, res) => {

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