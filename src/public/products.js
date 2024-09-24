
let cartId = sessionStorage.getItem('cartId');

async function getUser() {
    try {
        const response = await fetch('/api/users/getuser', { method: 'GET' });
        const data = await response.json();
        
        if(data) {
            cartId = data.payload.cartId;
            sessionStorage.setItem('cartId', cartId);
            return cartId;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert(error.message || 'Error al mostrar usuario');
    }
};

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
    cartId = await getUser();
    
    const response = await fetch(`/api/carts/${productId}/products/${cartId}`, { method: 'PUT' });
    const data = await response.json();
    
    if(data) {
        await updateNumber();
        alert(`Producto con id ${productId} agregado al carrito exitosamente`);
    } else {
        throw new Error(data.error);
    }
    } catch (error) {
        alert(error.message || `Error al agregar el producto con id ${productId} al carrito`);
    }
};

async function deleteProductToCart(productId) {
    try {
        cartId = await getUser();

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' });
        const data = await response.json();

        if(data) {
            await updateNumber();
            await viewCart();
            alert(`Producto con id ${productId} eliminado del carrito exitosamente`);
        } else {
            throw new Error(data.error);
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
            await updateNumber();
            window.location.href = `/cart/`;
        } catch (error) {
            alert(error.message || 'Error al mostrar carrito');
        }
};

async function deleteAllInCart(cId) {

    cartId = await getUser();

    try {
        const response = await fetch(`/api/carts/${cId}`, { method: 'PUT' });
        const data = await response.json();

        if(data) {
            alert(`El carrito con id ${cId} se vació exitosamente`);
            await viewCart();
            return cartId;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert(error.message || 'Error al vaciar carrito');
    }
};

async function purchase(cId) {

    cartId = await getUser();

    try {
        const response = await fetch(`/api/carts/${cId}/purchase`, { method: 'POST' });
        const data = await response.json();
        if(data) {
            alert(`Se realizó la compra del carrito con id ${cId} exitosamente, revisa tu email`);
            await viewCart();
            return cartId;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert(error.message || 'Error al mostrar carrito');
    }
};

async function updateNumber() {
    try {
        const user = await getUser();
        const number = document.getElementById('number');

        const response = await fetch(`/api/carts/${user}`, { method: 'GET' });
        const data = await response.json();

        const cart = data.payload.products;
        
        number.innerHTML = `${cart.length}`;
    } catch (error) {
        return err.message;
    }
};