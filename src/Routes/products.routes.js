import CustomRouter from './custom.router.js';
import ProductManager from '../controllers/productManager.js';
import config from '../config.js';
import { handlePolicies, verifyRequired } from "../services/utils.js";
import { generateMock } from '../services/fake.js'

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

        this.get ('/:category/:page/:limit/:sort', async (req, res) => {

            const category = req.params.category || null;
            const limit = +req.params.limit || 5;
            const page = +req.params.page || 1;
            const sort = req.params.sort || 'asc';
        
            try {
                const products = await manager.getAll(category, page, limit, sort);
                res.sendSuccess( products );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.get('/mocking/:qty', (req, res) => {
            const qty = parseInt(req.params.qty, 10);
            if (isNaN(qty) || qty <= 0) {
                return res.status(400).send({ error: 'not valid quantity' });
            }
            const mockProducts = generateMock(qty);
            res.json(mockProducts);
        });

        this.post ('/', verifyRequired(['title', 'description', 'price', 'category', 'status', 'thumbnails', 'code', 'stock']), handlePolicies (['user']), async (req, res) => {
            
            try {
                const socketServer = req.app.get('socketServer');
                
                const { title, description, price, code, stock, status, thumbnails, category } = req.body;

                const newProduct = {
                    title: title,
                    description: description,
                    price: price,
                    code: code,
                    stock: stock,
                    status: status,
                    category: category,
                    thumbnails: thumbnails || [],
                };
                
                const product = await manager.add(newProduct);
            
                res.sendSuccess( `se agrego ${product} correctamente` );
                socketServer.emit('newProduct', (req.body));

            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.delete('/:id', handlePolicies (['admin']), async (req, res) => {

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

        this.put('/:id', handlePolicies (['admin']), async (req, res) => {
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
