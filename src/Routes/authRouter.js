import { Router } from "express";
import passport from "passport";
import config from "../config.js";
import UsersManager from "../dao/users.manager.mdb.js";
import { verifyRequired, isValidPassword, createHash, adminAuth, createToken, verifyToken, verifyAuthorization } from "../utils.js";
import initAuthStrategies, {passportCall} from '../auth/passport.strategies.js';

const router = Router();
const manager = new UsersManager();
initAuthStrategies();

router.post('/register', verifyRequired(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
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

router.post('/jwtregister', verifyRequired(['firstName', 'lastName', 'email', 'password']), passport.authenticate('register', { failureRedirect: `/register?error=${encodeURI('El email ya se encuentra registrado')}`}), async (req, res) => {
    try {
        const token = createToken(req.user, '1h');
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.status(200).send({ origin: config.SERVER, payload: 'Usuario registrado'});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post('/login', verifyRequired(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Campos faltantes");
            return res.status(400).json({ message: 'All fields are required' });
        }
        const foundUser = await manager.getOne({ email: email });

        if (!foundUser) {
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

router.post('/jwtlogin', verifyRequired(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
    try {
        const token = createToken(req.user, '1h');
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.status(200).send({ origin: config.SERVER, payload: 'Usuario autenticado'});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
    
});

router.get('/ghlogin', passport.authenticate('ghlogin', {scope: ['user:email']}), async (req, res) => {
});

router.get('/ghlogincallback', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/googlelogin', passport.authenticate('googlelogin', { scope: ['profile'] }), async (req, res) => {
});

router.get('/goologincallback', passport.authenticate('googlelogin', {session: false,
    failureRedirect: `/login?error=${encodeURI('Error al identificar con Google')}`, successReturnToOrRedirect: '/' }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
})

router.get('/current', passportCall('jwtlogin'), async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ' + req.user.firstName});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/profile', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');
        res.render('profile', {user:req.session.user});
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/admin', verifyToken, verifyAuthorization('admin'), async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try {

        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;