import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth20';

import CartService from '../dao/mongo/carts.dao.mdb.js';
import UsersManager from '../controllers/usersManager.js';
import { isValidPassword, createHash } from '../services/utils.js';

const localStrategy = local.Strategy;

const manager = new UsersManager();
const service = new CartService();

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
                const { firstName, lastName, age, password} = req.body;
                const foundUser = await manager.getOne({ email: username });
                const passHash = createHash(password);
                
                let cartId = await service.addService();
                cartId = cartId._id.toString();


                if (!foundUser) {
                    const newUser = await manager.add({ firstName: firstName, lastName: lastName, email: username, age: age, password: passHash, cartId: cartId});
                    const { password, ...filteredUser} = newUser
                    console.log(filteredUser);
                    
                    return done(null, filteredUser );
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('ghlogin', new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log({profile});
                const email = profile._json?.email || null;
                
                if (email) {
                    const foundUser = await manager.getOne({ email: email });

                    if (!foundUser) {
                        const user = {
                            firstName: profile._json.name.split(' ')[0],
                            lastName: profile._json.name.split(' ')[1],
                            email: email,
                            password: 'none'
                        }
                        const process = await manager.add(user);
                        return done(null, process);
                    } else {
                        return done(null, foundUser);
                    }
                } else {
                    return done(new Error('Faltan datos de perfil'), null);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('googlelogin', new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, cb) => {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            cb(null, profile);
            try {
                const email = profile._json?.email || null;
                
                if (email) {
                    const foundUser = await manager.getOne({ email: email });

                    if (!foundUser) {
                        const user = {
                            firstName: profile._json.name.split(' ')[0],
                            lastName: profile._json.name.split(' ')[1],
                            email: email,
                            password: 'none'
                        }
                        const process = await manager.add(user);
                        return cb(null, process);
                    } else {
                        return cb(null, foundUser);
                    }
                } else {
                    return cb(new Error('Faltan datos de perfil'), null);
                }
            } catch (err) {
                return cb(err, false);
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

export default initAuthStrategies;
