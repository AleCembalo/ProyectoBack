class ProductsDto {
    
    constructor(product) {
        this.product = product;
        this.title = product.title.toUpperCase();
        this.description = product.description;
        this.price = product.price;
        this.thumbnails = product.thumbnails;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status;
    }
}

export default ProductsDto;