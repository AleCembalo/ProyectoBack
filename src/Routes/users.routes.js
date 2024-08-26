import CustomRouter from './custom.router.js';
import UsersManager from '../controllers/usersManager.js';
import CartService from "../dao/mongo/carts.dao.mdb.js";
import nodemailer from 'nodemailer';
import config from '../config.js';
import { handlePolicies, verifyRequired, createToken, isValidPassword, createHash} from '../services/utils.js';

const service = new CartService();
const manager = new UsersManager();

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
    user: config.GMAIL_APP_USER,
    pass: config.GMAIL_APP_PASS
    }
});

export default class UsersRouter extends CustomRouter {
    
    init () {

        this.get('/', async (req, res) => {
            try {
                const process = await manager.get();
                res.sendSuccess( process );
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

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
        
        this.post('/', verifyRequired(['firstName', 'lastName', 'age', 'email', 'password']), async (req, res) => {
            try {
                const { firstName, lastName, age, email, password } = req.body;
                const foundUser = await manager.getOne({ email: email });
                
                const passHash = createHash(password);
                
                let cartId = await service.addService();
                cartId = cartId._id.toString();
                
                if (foundUser === null) {
                    console.log('llega');
                    const newUser = await manager.add({ firstName: firstName, lastName: lastName, email: email, age: age, password: passHash, cartId: cartId});
                    const { password, ...filteredUser} = newUser;
                
                    return res.sendSuccess(filteredUser._doc);
                } else {
                    res.sendUserError( 'El email ya se encuentra registrado' );
                }
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.post('/restoremethod', verifyRequired(['email']), async (req, res) => {
            try {
                const { email } = req.body;

                if (!email) {
                    res.sendUserError( 'field are required' );
                }
                const foundUser = await manager.getOne({ email: email });
                if (!foundUser) {
                    res.sendUserError( 'User not found' );
                }
                if (foundUser) {
                    const token = createToken(foundUser, '5m');
                    await transport.sendMail({
                        from: `Sistema Chemba <${config.GMAIL_APP_USER}>`,
                        to: `${foundUser.email}`,
                        subject: 'Pruebas Nodemailer',
                        html: `<div>
                                    <h1>Hola ${foundUser.firstName}</h1>
                                    <p>Hemos recibido una solicitud para reestablecer tu contraseña, si no has sido quien la envió, por favor desestima este correo. Si tu la enviaste ingresa al siguiente link, gracias!</p>
                                    <button class="btn btn-success btn-100"><a class="a2" href="http://127.0.0.1:8080/restorepassword?access_token=${token}">cambiar contraseña</a></button>
                                </div>`
                        });
                        res.sendSuccess(token);
                }
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.post('/restorepassmethod/:id', verifyRequired(['password', 'password2']), async (req, res) => {
            if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
                res.sendUserError( 'Id no válido' );
            }

            try {
                const user = await manager.getById(req.params.id);
                const { password, password2 } = req.body;
                
                if (password !== password2) {
                    console.log( 'los campos deben coincidir' );
                } else {
                    if (isValidPassword(password, user.password)) {
                        console.log( 'la clave actual no puede ser igual a la anterior' );
                    } else{
                        const passHash = createHash(password);
                        const filter = { _id: req.params.id };
                        const update = { password: passHash };
                        const options = { new: true };
                        await manager.update(filter, update, options);
                        res.sendSuccess('ok');
                    }
                }
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });

        this.put('/premium/:uid', async (req, res) => {

            if (!config.MONGODB_ID_REGEX.test(req.params.uid)) {
                res.sendUserError( 'Id no válido' );
            }
            try{
                const user = await manager.getById(req.params.uid);
                if (user.role === 'user') {
                    const filter = { _id: req.params.uid };
                    const update = { role: 'premium'};
                    const options = { new: true };
                    await manager.update(filter, update, options);
                    res.sendSuccess('ok');
                } else if (user.role ==='premium') {
                    const filter = { _id: req.params.uid };
                    const update = { role: 'user'};
                    const options = { new: true };
                    await manager.update(filter, update, options);
                    res.sendSuccess('ok');
                }
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.put('/:id', handlePolicies (['admin']), async (req, res) => {

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
        
        this.delete('/:id', handlePolicies (['admin']), async (req, res) => {

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