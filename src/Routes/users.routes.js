import CustomRouter from './custom.router.js';
import UsersManager from '../controllers/users.manager.mdb.js';

const manager = new UsersManager();

export default class UsersRouter extends CustomRouter {
    
    init () {
        
        this.get('/aggregate/:role', async (req, res) => {
            try {
                if (req.params.role === 'admin' || req.params.role === 'premium' || req.params.role === 'user') {
                    const match = { role: req.params.role };
                    const sort = { lastName: -1 };
                    const process = await manager.getAggregated(match, sort);
        
                    res.sendSuccess( process );
                } else {
                    res.sendUserError( 'role: solo se acepta admin, premium o user' );
                }
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/paginate/:page/:limit', async (req, res) => {
            try {
                const filter = { role: 'admin' };
                const options = { page: req.params.page, limit: req.params.limit, sort: { lastName: 1 } };
                const process = await manager.getPaginated(filter, options);
                
                res.sendSuccess( process );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.post('/', async (req, res) => {
            try {
                const process = await manager.add(req.body);
                
                res.sendSuccess( process );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.put('/:id', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                res.sendUserError( 'Id no válido' );
            }
            try {
                const filter = { _id: req.params.id };
                const update = req.body;
                const options = { new: true };
                const process = await manager.update(filter, update, options);
                
                res.sendSuccess( process );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.delete('/:id', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                res.sendUserError( 'Id no válido' );
            }
            try {
                const filter = { _id: req.params.id };
                const process = await manager.delete(filter);
        
                res.sendSuccess( process );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
    }
}