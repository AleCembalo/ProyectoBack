// import fs from 'fs';
// import path from 'path';
// import config from '../config.js'

// const url = path.join(config.DIRNAME, '/Data/products.json'); 

// class ProductManager {

//     constructor() {
//         this.products = [];
//     }

//     async writeFile() {
//         const data = JSON.stringify(this.products, 'utf-8');
//         await fs.promises.writeFile(url, data);
//     }  

//     async readFile() {
//         const data = await fs.promises.readFile(url, 'utf-8');
//         const products = await JSON.parse(data);
//         this.products = products;
//     }

//     async addProduct(product) {
//         await this.getProducts(0);
//         const { title, description, category, price, thumbnail, code, status = true, stock } = product;
        
//         let exist = this.products.find((p) => p.code === product.code);

//         if (exist) {
//             console.log("Código existente!");
//             return;
//         }
//         if ((title && description && category && price && thumbnail && code && status && stock) !== '') {
//             product.id = this.products.length + 1;
//             this.products.push(product);
//             await this.writeFile();
//         } else {
//             console.log("Debe completar todos los campos");
//         }
//     }

//     async getProducts(limit) {
//         await this.readFile();
//         return limit === 0 ? this.products : this.products.slice(0, limit);
//     }

//     async getProductById(id) {
//         await this.readFile();
//         const product = this.products.find((p) => p.id === +id) || {};
//         return product;
//     }

//     async deleteById(id) {
//         await this.readFile();
//         const updatedProducts = this.products.filter((p) => p.id !== id);
//         this.products = updatedProducts;
//         await this.writeFile();
//         return this.products;
//     }

//     async updated(id, updatedProd) {
//         await this.readFile();
//         const productIndex = this.products.findIndex((p) => p.id === id);
//         if (productIndex !== -1) {
//             const updated = {
//                 ...this.products[productIndex],
//                 ...updatedProd
//             };
//             this.products[productIndex] = updated;

//             this.writeFile();

//         } else {
//             throw new Error("Producto no encontrado");
//         }
//     }
// }

// export default ProductManager;

// const productManager = new ProductManager();

// console.log(productManager.products);
// Agregar productos

// await productManager.addProduct({
//     title: "Producto 1",
//     description: "Descripción 1",
//     price: 100,
//     thumbnail: "ruta/imagen1",
//     status: true,
//     category: "Electronic",
//     code: "cod1",
//     stock: 10,
// });

// await productManager.addProduct({
//     title: "Producto 2",
//     description: "Descripción 2",
//     code: "cod2",
//     price: 200,
//     status: true,
//     category: "category1",
//     thumbnail: "ruta/imagen2",
//     stock: 5,
// });

// await productManager.addProduct({
//     title: "Producto 3",
//     description: "Descripción 3",
//     code: "cod3",
//     price: 150,
//     status: false,
//     category: "category2",  
//     thumbnail: "ruta/imagen3",
//     stock: 20
// });

// await productManager.addProduct({
//     title: "Producto 6",
//     description: "Descripción 6",
//     code: "cod6",
//     price: 150,
//     status: false,
//     category: "category1",  
//     thumbnail: "ruta/imagen6",
//     stock: 21,
// });


// mostrar productos agregados

// console.log (await productManager.getProducts());

// mostrar productos por ID

// const producto = productManager.getProductById(1);
// console.log(producto);

// borrar producto por ID

// console.log(await productManager.deleteById(5));

// actualizar producto

// productManager.updated(2, {
//     price: 22
// });