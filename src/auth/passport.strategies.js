import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth20';

import jwt from 'passport-jwt';

import config from '../config.js';
import UsersManager from '../dao/users.manager.mdb.js';
import { isValidPassword, createHash } from '../utils.js';

const localStrategy = local.Strategy;

const jwtStrategy = jwt.Strategy;
const jwtExtractor = jwt.ExtractJwt;

const manager = new UsersManager();

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies[`${config.APP_NAME}_cookie`];
    
    return token;
}

const initAuthStrategies = () => { 

    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                
                const foundUser = await manager.getOne({ email: username });

                if (foundUser && isValidPassword(password, foundUser.password)) {
                    const { password, ...filteredFoundUser } = foundUser;
                    return done(null, filteredFoundUser);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const { firstName, lastName, password} = req.body;
                const foundUser = await manager.getOne({ email: username });
                const passHash = createHash(password);

                if (!foundUser) {
                    const newUser = await manager.add({ firstName: firstName, lastName: lastName, email: username, age: age, password: passHash});
                    const { password, ...filteredUser} = newUser
                    return done(null, filteredUser );
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    // passport.use('ghlogin', new GitHubStrategy(
    //     {
    //         clientID: process.env.GITHUB_CLIENT_ID,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //         callbackURL: config.GITHUB_CALLBACK_URL
    //     },
    //     async (accessToken, refreshToken, profile, done) => {
    //         try {
    //             console.log({profile});
    //             const email = profile._json?.email || null;
                
    //             if (email) {
    //                 const foundUser = await manager.getOne({ email: email });

    //                 if (!foundUser) {
    //                     const user = {
    //                         firstName: profile._json.name.split(' ')[0],
    //                         lastName: profile._json.name.split(' ')[1],
    //                         email: email,
    //                         password: 'none'
    //                     }
    //                     const process = await manager.add(user);
    //                     return done(null, process);
    //                 } else {
    //                     return done(null, foundUser);
    //                 }
    //             } else {
    //                 return done(new Error('Faltan datos de perfil'), null);
    //             }
    //         } catch (err) {
    //             return done(err, false);
    //         }
    //     }
    // ));

    // passport.use('googlelogin', new GoogleStrategy(
    //     {
    //         clientID: process.env.GOOGLE_CLIENT_ID,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //         callbackURL: config.GOOGLE_CALLBACK_URL
    //     },
    //     async (accessToken, refreshToken, profile, cb) => {
    //         console.log(accessToken);
    //         console.log(refreshToken);
    //         console.log(profile);
    //         cb(null, profile);
    //         try {
    //             const email = profile._json?.email || null;
                
    //             if (email) {
    //                 const foundUser = await manager.getOne({ email: email });

    //                 if (!foundUser) {
    //                     const user = {
    //                         firstName: profile._json.name.split(' ')[0],
    //                         lastName: profile._json.name.split(' ')[1],
    //                         email: email,
    //                         password: 'none'
    //                     }
    //                     const process = await manager.add(user);
    //                     return cb(null, process);
    //                 } else {
    //                     return cb(null, foundUser);
    //                 }
    //             } else {
    //                 return cb(new Error('Faltan datos de perfil'), null);
    //             }
    //         } catch (err) {
    //             return cb(err, false);
    //         }
    //     }
    // ));

    passport.use('jwtlogin', new jwtStrategy(
        {
            jwtFromRequest: jwtExtractor.fromExtractors([cookieExtractor]),
            secretOrKey: config.SECRET
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
        
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            // if (!user) return res.status(401).send({ origin: config.SERVER, payload: null, error: info.messages ? info.messages : info.toString() });
            if (!user) return res.status(401).send({ origin: config.SERVER, payload: null, error: 'Usuario no autenticado' });

            req.user = user;
            next();
        })(req, res, next);
    }
};

export default initAuthStrategies;
