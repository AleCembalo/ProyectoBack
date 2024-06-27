import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import FileStore from 'session-file-store';
// import MongoStore from 'connect-mongo';
import passport from 'passport';

import initSocket from './sockets.js';
import config from './config.js';
import productRouter from './Routes/productsRouter.js';
import cartsRouter from './Routes/cartsRouter.js';
import usersRouter from './Routes/usersRouter.js'
import viewsRouter from './Routes/viewsRouter.js';
import cookiesRouters from './Routes/cookiesRouter.js';
import authRouter from './Routes/AuthRouter.js';

const app = express();

app.use(cors());
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
// app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cookies', cookiesRouters);
app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));

const expressInstance = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`Servidor activo en puerto ${config.PORT} enlazada a bbdd ${config.SERVER}`);
});

const socketServer = initSocket(expressInstance);
app.set('socketServer', socketServer);