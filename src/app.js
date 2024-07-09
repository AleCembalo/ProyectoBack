import express from 'express';
import session from 'express-session';
import cors from 'cors';
// import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import FileStore from 'session-file-store';
// import MongoStore from 'connect-mongo';
import passport from 'passport';

import initSocket from './sockets.js';
import config from './config.js';
import ProductsRouter from './routes/products.routes.js';
import AuthRouter from './routes/auth.routes.js';
import CartsRouter from './routes/carts.routes.js';
import CookiesRouter from './routes/cookies.routes.js';
import UsersRouter from './routes/users.routes.js';
import ViewsRouter from './Routes/views.routes.js';
import MongoSingleton from './services/mongo.singleton.js';

const app = express();

const expressInstance = app.listen(config.PORT, async () => {
    // await mongoose.connect(config.MONGODB_URI);
    MongoSingleton.getInstance();

    const socketServer = initSocket(expressInstance);
    app.set('socketServer', socketServer);

    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(cookieParser(config.SECRET));

    const fileStorage = FileStore(session);
    app.use(session({
        store: new fileStorage({
            path: './sessions',
            ttl: 600,
            retries: 0
        }),
        // store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 600 }),
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}views`);
    app.set('view engine', 'handlebars');

    app.use('/', new ViewsRouter().getRouter());
    app.use('/api/auth', new AuthRouter().getRouter());
    app.use('/api/cookies', new CookiesRouter().getRouter());
    app.use('/api/products', new ProductsRouter().getRouter());
    app.use('/api/users', new UsersRouter().getRouter());
    app.use('/api/carts', new CartsRouter().getRouter());
    app.use('/static', express.static(`${config.DIRNAME}/public`));

    console.log(`Servidor activo en puerto ${config.PORT} PID ${process.pid} enlazada a bbdd ${config.SERVER}`);
});