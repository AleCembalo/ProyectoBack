
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import config from './Config/config.js';
import productRouter from './Routes/productsRouter.js';
import cartsRouter from './Routes/cartsRouter.js';
import viewsRouter from './Routes/viewsRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}views`);
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));

const httpServer = app.listen ( config.PORT, () => { console.log (`Servidor activo en puerto ${config.PORT}`); });

const socketServer = new Server(httpServer);

app.set('socketServer', socketServer);

socketServer.on('connection', async (socket) => {
    console.log("Nueva conexión");

    try {
        const products = await productManager.getProducts();
        socketServer.emit('products', products)
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    };

    socket.on('newProduct', async (newProduct) => {
        try {
            const newProd = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,
            }

            await productManager.addProduct(newProd);
            const updatedList = await productManager.getProducts();
            socketServer.emit('products', updatedList);
            socketServer.emit('response', { status: 'success', message: `Product added successfully` })
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            const pId = parseInt(id);
            await productManager.deleteProduct(pId);
            const updatedList = await productManager.getProducts();
            console.log(`Product with id ${pId} successfully deleted`);
            socketServer.emit('products', updatedList);
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })
});    