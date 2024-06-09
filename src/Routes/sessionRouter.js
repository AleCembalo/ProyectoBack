import { Router } from "express";
import passport from "passport";
import config from "../Config/config.js";
import UsersManager from "../dao/users.manager.mdb.js";
import { verifyRequired, isValidPassword, createHash, adminAuth } from "../utils.js";

const sessionsRouter = Router();
const manager = new UsersManager();

sessionsRouter.get('/hash/:password', async (req, res) => {
    res.status(200).send({ origin: config.SERVER, payload: createHash(req.params.password) });
});

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
            res.status(400).send({ origin: config.SERVER, payload: 'El email ya se encuentra registrado' });
        }
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

        if (foundUser.email === email && foundUser.password === password) {
            req.session.user = { firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email};
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
        // Passport inyecta los datos del done en req.user
        req.session.user = req.user;
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

export default sessionsRouter;