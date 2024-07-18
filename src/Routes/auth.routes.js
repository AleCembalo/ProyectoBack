import CustomRouter from './custom.router.js';
import passport from "passport";
import UsersManager from "../controllers/usersManager.js";
import { verifyRequired, isValidPassword, createHash, verifySession, handlePolicies } from "../services/utils.js";
import initAuthStrategies from '../auth/passport.strategies.js';
import nodemailer from 'nodemailer';
import config from '../config.js';

const manager = new UsersManager();

initAuthStrategies();

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_APP_USER,
        pass: config.GMAIL_APP_PASS
    }
});

export default class AuthRouter extends CustomRouter {
    
    init () {

        this.post('/register', verifyRequired(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
            try{
                const { firstName, lastName, age, email, password } = req.body;
                const foundUser = await manager.getOne({ email: email });
                const passHash = createHash(password);
                
                let cartId = await service.addService();
                cartId = cartId._id.toString();

        
                if (!foundUser) {
                    await manager.add({ firstName, lastName, age, email, password: passHash, cartId});
                    req.session.user = { firstName: firstName, lastName: lastName, age: age, email: email, cartId: cartId};
                    const confirmation = await transport.sendMail({
                        from: `Sistema Chemba <${config.GMAIL_APP_USER}>`,
                        to: 'alejandracembalo@hotmail.com',
                        subject: 'Pruebas Nodemailer',
                        html: `<h1>Hola, te registraste de manera exitosa! </h1>`
                    });
                    res.sendSuccess(confirmation);
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
        
        this.post('/login', verifyRequired(['email', 'password']), async (req, res) => {
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
        
        this.get('/current', verifySession, handlePolicies (['admin']), async (req, res) => {
            try {
                res.sendSuccess('Bienvenido ' + req.session.user.firstName);
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
            } catch (err) {
                res.sendServerError( 'error' );
            }
        });
    }
}