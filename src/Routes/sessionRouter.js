import { Router } from "express";
import config from "../Config/config.js";

const sessionsRouter = Router();

const adminAuth = (req, res, next) => {
    
    if (req.session.user?.role !== 'admin')
        return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

    next();
}

sessionsRouter.post('/register', async (req, res) => {
    
});

sessionsRouter.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        const savedFirstName = 'José';
        const savedLastName = 'Perez';
        const savedEmail = 'idux.net@gmail.com';
        const savedPassword = 'abc123';
        const savedRole = 'admin';

        if (email !== savedEmail || password !== savedPassword) {
            return res.status(401).send({ origin: config.SERVER, payload: 'Datos de acceso no válidos' });
        }
        
        req.session.user = { firstName: savedFirstName, lastName: savedLastName, email: email, role: savedRole };
        
        res.redirect('/products');
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