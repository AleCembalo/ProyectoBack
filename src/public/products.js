
let cartId = sessionStorage.getItem('cartId');

async function createCart() {
    try {
        const response = await fetch('/api/carts', { method: 'POST' });
        const data = await response.json();
        
        if(data) {
            cartId = data.payload._id;
            sessionStorage.setItem('cartId', cartId);
            return cartId;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert(error.message || 'Error al crear el carrito');
    }
};

async function addProductToCart(productId) {
try {
    if(!cartId) {
        cartId = await createCart();
    }
    const response = await fetch(`/api/carts/${productId}/products/${cartId}`, { method: 'PUT' });
    const data = await response.json();
    if(data) {
        alert(`Producto con id ${productId} agregado al carrito exitosamente`);
    } 
    } catch (error) {
        alert(error.message || `Error al agregar el producto con id ${productId} al carrito`);
    }
};

async function deleteProductToCart(productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' });
        const data = await response.json();
        if(data) {
            alert(`Producto con id ${productId} eliminado del carrito exitosamente`);
        } 
        } catch (error) {
            alert(error.message || `Error al eliminar el producto con id ${productId} del carrito`);
        }
    };

    async function viewCart() {
        try {
            if(!cartId) {
                cartId = await createCart();
            }
            window.location.href = `/cart/`;
        } catch (error) {
            alert(error.message || 'Error al mostrar carrito');
        }
    };