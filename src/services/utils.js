
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';

import { errorsDictionary } from '../config.js';
import CustomError from './customError.class.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const verifySession = (req, res, next) => {
    try {
        if (req.session.user) return next();
        throw new CustomError(errorsDictionary.LOGIN_ERROR)
    } catch (error) {
        next (error)
    }
};

export const createToken = (payload, duration) => jwt.sign(payload, config.SECRET, { expiresIn: duration });

export const verifyToken = (req, res, next) => {
    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1]: undefined;
    const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`] ? req.cookies[`${config.APP_NAME}_cookie`]: undefined;
    const queryToken = req.query.access_token ? req.query.access_token: undefined;
    const receivedToken = headerToken || cookieToken || queryToken;

    if (!receivedToken) return res.status(401).send({ origin: config.SERVER, payload: 'Se requiere token' });

    jwt.verify(receivedToken, config.SECRET, (err, payload) => {
        if (err) return res.status(403).send({ origin: config.SERVER, payload: 'Token no válido' });
        req.user = payload;
        next();
    });
}

export const verifyRequired = (requiredFields) => {
    return (req, res, next) => {
        try {
            const allOk = requiredFields.every(field => 
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined);
            if (allOk) return next();
            throw new CustomError(errorsDictionary.FEW_PARAMETERS)
        } catch (error) {
            next (error);
        }
    };
};

export const handlePolicies = policies => {
    return async (req, res, next) => {
        try {
            if (!req.session.user) return res.status(401).send({ origin: config.SERVER, payload: 'Usuario no autenticado' });
            if (policies.includes('self') && req.session.user.cartId === req.params.cid) return next();
            if (policies.includes(req.session.user.role)) return next();
            throw new CustomError(errorsDictionary.ACCESS_ERROR)
        } catch (error) {
            next (error);
        }
    }
};

export function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 10;

    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
};