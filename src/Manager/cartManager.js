import fs from 'fs';
import path from 'path';
import config from '../Config/config.js'

const url = path.join(config.DIRNAME, '/Data/carts.json');
const urlProd = path.join(config.DIRNAME, '/Data/products.json');

class CartManager {

    constructor() {
        this.carts = [];
    }

    async writeFile() {
        const data = JSON.stringify(this.carts, 'utf-8');
        await fs.promises.writeFile(url, data);
    }

    async readFile() {
        const data = await fs.promises.readFile(url, 'utf-8');
        const carts = await JSON.parse(data);
        this.carts = carts;
    }

    async createCart() {
        await this.readFile();

        const newCart = {
            id: this.carts.length + 1,
            products: []
        };
        this.carts.push(newCart);
        await this.writeFile();
    }

    async getCartById(id) {
        await this.readFile();
        const cart = this.carts.find((c) => c.id === +id) || {};
        return cart;
    }

    async productToCar(idProduct, idCart) {
        const data = await fs.promises.readFile(urlProd, 'utf-8');
        const parseProducts = await JSON.parse(data);
        await this.readFile();

        let cart = this.carts.find((c) => c.id === +idCart); 
        let product = parseProducts.find((p) => p.id === +idProduct);
        let exist = cart.products.find((p) => p.product === +idProduct) || {};

        let quantity = exist.quantity || 1;
        if (exist.product) {
            
            exist.quantity = quantity+1;    
            
            await this.writeFile();
            
        } else {
            cart.products.push({
                product: product.id,
                quantity
            });
            await this.writeFile();
        }
    }
}

export default CartManager;

// const cartManager = new CartManager;
// await cartManager.productToCar(1, 1);
// cartManager.createCart();