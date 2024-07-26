
import bcrypt from 'bcrypt';
import config from '../config.js';

import { errorsDictionary } from '../config.js';
import CustomError from './customError.class.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const verifySession = (req, res, next) => {

    if (!req.session.user) return res.status(401).send({ origin: config.SERVER, payload: 'Usuario no autenticado' });
    next();
};

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