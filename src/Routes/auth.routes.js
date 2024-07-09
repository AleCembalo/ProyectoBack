import CustomRouter from './custom.router.js';
import passport from "passport";
import UsersManager from "../controllers/users.manager.mdb.js";
import { verifyRequired, isValidPassword, createHash, adminAuth, createToken, verifyToken, verifyAuthorization } from "../utils.js";
import initAuthStrategies from '../auth/passport.strategies.js';

const manager = new UsersManager();
initAuthStrategies();

export default class AuthRouter extends CustomRouter {
    
    init () {

        this.post('/register', verifyRequired(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
            try{
                const { firstName, lastName, age, email, password } = req.body;
                const foundUser = await manager.getOne({ email: email });
        
                if (!foundUser) {
                    await manager.add({ firstName, lastName, age, email, password: createHash(password)});
                    req.session.user = { firstName: firstName, lastName: lastName, age: age, email: email};
                    req.session.save(err => {
                        if (err) return res.sendServerError('error');
                        res.redirect('/profile');
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
                req.session.save(err => {
                    if (err) return res.sendServerError( 'error' );
                    res.redirect('/products');
                });
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.post('/login', verifyRequired(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
            try {
                const { email, password } = req.body;
        
                if (!email || !password) {
                    res.sendUserError( 'All fields are required' );
                }
                const foundUser = await manager.getOne({ email: email });
                if (!foundUser) {
                    res.sendUserError( 'User not found' );
                }
                if (foundUser && isValidPassword (password, foundUser.password)) {
                    const { password, ...filteredFoundUser } = foundUser;
                    req.session.user = filteredFoundUser;
                    req.session.save(err => {
                        if (err) return res.sendServerError( 'error' );
                        res.redirect('/products');
                    })
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
                    res.redirect('/products');
                });
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
        
        this.get('/current', adminAuth, async (req, res) => {
            try {
                res.sendSuccess('Bienvenido ' + req.user.firstName);
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/profile', async (req, res) => {
            try {
                if (!req.session.user) return res.redirect('/login');
                res.render('profile', {user: req.session.user});
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
        
        this.get('/admin', verifyToken, verifyAuthorization('admin'), async (req, res) => {
            try {
                res.sendSuccess('Bienvenido ADMIN!');
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
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
    }
}