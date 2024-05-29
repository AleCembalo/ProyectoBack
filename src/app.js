
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';

import initSocket from './sockets.js';
import config from './Config/config.js';
import productRouter from './Routes/productsRouter.js';
import cartsRouter from './Routes/cartsRouter.js';
import viewsRouter from './Routes/viewsRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));

const expressInstance = app.listen ( config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);
    console.log (`Servidor activo en puerto ${config.PORT} enlazada a bbdd ${config.SERVER}`); 
});

const socketServer = initSocket(expressInstance);
app.set('socketServer', socketServer);



