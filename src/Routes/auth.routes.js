import CustomRouter from './custom.router.js';
import passport from "passport";
import UsersManager from "../controllers/usersManager.js";
import CartService from "../dao/mongo/carts.dao.mdb.js";
import { verifyRequired, isValidPassword, createHash, verifySession, handlePolicies } from "../services/utils.js";
import initAuthStrategies from '../auth/passport.strategies.js';

const service = new CartService();
const manager = new UsersManager();

initAuthStrategies();

export default class AuthRouter extends CustomRouter {
    
    init () {

        this.post('/register', verifyRequired(['firstName', 'lastName', 'email', 'password', 'age']), async (req, res) => {

            try{
                const { firstName, lastName, age, email, password, role } = req.body;
                const foundUser = await manager.getOne({ email: email });
                
                const passHash = createHash(password);
                
                let cartId = await service.addService();
                cartId = cartId._id.toString();
                role ? role : 'user';
                if (!foundUser) {
                    await manager.add({ firstName, lastName, age, role, email, password: passHash, cartId});
                    req.session.user = { firstName: firstName, lastName: lastName, age: age, role: role, email: email, cartId: cartId};
                    
                    req.session.save(err => {
                        if (err) return res.sendServerError('error');
                        res.sendSuccess(req.session.user);
                        // res.redirect('/profile');
                    })
                } else {
                    res.sendUserError( 'El email ya se encuentra registrado' );
                }
            } catch (err) {
                res.sendServerError('error');
            }
        });

        this.post('/sessionregister', verifyRequired(['firstName', 'lastName', 'email', 'password']), passport.authenticate ('register', { failureRedirect: `/register?error=${encodeURI('El email ya se encuentra registrado')}`}), async (req, res) =>{

            try {
                req.session.user = req.user._doc;
                res.sendSuccess(req.session.user);
                req.session.save(err => {
                    if (err) return res.sendServerError( 'error' );
                    res.redirect('/products');
                });
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.post('/login', verifyRequired(['email', 'password']), async (req, res) => {
            try {
                const { email, password } = req.body;
                
                if (!email || !password) {
                    res.sendUserError( 'Todos los campos deben ser completados' );
                }
                const foundUser = await manager.getOne({ email: email });
                
                // Calculo de los tres meses
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                
                // Se compara con last_conection para evaluar active
                foundUser.active = foundUser.last_connection < threeMonthsAgo ? false : true;

                if (foundUser && isValidPassword (password, foundUser.password) && foundUser.active === true) {
                    const { password, ...filteredFoundUser } = foundUser;
                    await manager.update({_id: filteredFoundUser._id}, {
                        last_connection: new Date()}, { new: true})
                    req.session.user = filteredFoundUser;
                    req.session.save(err => {
                        if (err) return res.sendServerError( 'error' );
                        res.redirect('/products');
                        // res.sendSuccess(req.session.user);
                    })
                    req.logger.http(`${req.method} in ${req.baseUrl} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} user id: ${req.session.user._id} login`);
                } else {
                    return res.sendUserError('No se encuentra el usuario o han pasado 3 meses desde su última conexión');
                }
            }
            catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.post('/sessionlogin', verifyRequired(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
            try {
                req.session.user = req.user;
                req.session.save(err => {
                    if (err) return res.sendServerError( 'error' );
                    // res.sendSuccess(req.session.user);
                    res.redirect('/products');
                });
                req.logger.http(`${req.method} in ${req.baseUrl} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} user id: ${req.session.user._id} login`);
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/ghlogin', passport.authenticate('ghlogin', {scope: ['user:email']}), async (req, res) => {
        });
        
        this.get('/ghlogincallback', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
            try {
                req.session.user = req.user;
                req.session.save(err => {
                    if (err) return res.sendServerError( 'error' );
                    res.redirect('/profile');
                });
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/googlelogin', passport.authenticate('googlelogin', { scope: ['profile'] }), async (req, res) => {
        });
        
        this.get('/goologincallback', passport.authenticate('googlelogin', {session: false,
            failureRedirect: `/login?error=${encodeURI('Error al identificar con Google')}`, successReturnToOrRedirect: '/' }), async (req, res) => {
            try {
                req.session.user = req.user;
                req.session.save(err => {
                    if (err) return res.sendServerError( 'error' );
                    res.redirect('/profile');
                });
            } catch (err) {
                res.sendServerError( 'error' );
            }
        })
        
        this.get('/current', verifySession, handlePolicies (['admin']), async (req, res) => {
            try {
                res.sendSuccess(req.session.user);
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/profile', verifySession, async (req, res) => {
            try {
                if (!req.session.user) return res.redirect('/login');
                res.render('profile', {user: req.session.user});
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/logout', async (req, res) => {
            try {
                req.session.destroy((err) => {
                    if (err) return res.sendServerError( 'Error al ejecutar logout' );
                    res.redirect('/login');
                });
                req.logger.http(`${req.method} in ${req.baseUrl} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} user id: ${req.session.user._id} logout`);
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
    }
}