import { Router } from "express";
import passport from "passport";
import config from "../config.js";
import UsersManager from "../dao/users.manager.mdb.js";
import { verifyRequired, isValidPassword, createHash, adminAuth } from "../utils.js";
import initAuthStrategies from '../auth/passport.strategies.js';

const sessionsRouter = Router();
const manager = new UsersManager();
initAuthStrategies();

sessionsRouter.post('/register', verifyRequired(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
    try{
        const { firstName, lastName, email, password } = req.body;
        const foundUser = await manager.getOne({ email: email });

        if (!foundUser) {
            await manager.add({ firstName, lastName, email, password: createHash(password)});
            req.session.user = { firstName: firstName, lastName: lastName, email: email};
            req.session.save(err => {
                if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

                res.redirect('/profile');
            })
            
        } else {
            res.status(401).send({ origin: config.SERVER, payload: 'El email ya se encuentra registrado' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.post('/ppregister', verifyRequired(['firstName', 'lastName', 'email', 'password']), passport.authenticate ('register', { failureRedirect: `/register?error=${encodeURI('El email ya se encuentra registrado')}`}), async (req, res) =>{

    try {
        req.session.user = req.user._doc;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/products');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.post('/login', verifyRequired(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Campos faltantes");
            return res.status(400).json({ message: 'All fields are required' });
        }
        const foundUser = await manager.getOne({ email: email });

        if (!foundUser) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: 'User not found' });
        }

        if (foundUser && isValidPassword (password, foundUser.password)) {
            const { password, ...filteredFoundUser } = foundUser;
            req.session.user = filteredFoundUser;
            req.session.save(err => {
                if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

                res.redirect('/products');
            })
        }    
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.post('/pplogin', verifyRequired(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
    try {

        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/products');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.get('/ghlogin', passport.authenticate('ghlogin', {scope: ['user']}), async (req, res) => {
});

sessionsRouter.get('/ghlogincallback', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
    try {
        req.session.user = req.user
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.get('/logout', async (req, res) => {
    try {

        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.get('/profile', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');
        res.render('profile', {user:req.session.user});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

sessionsRouter.get('/admin', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default sessionsRouter;