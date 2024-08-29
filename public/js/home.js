//Entrar a la pagina Log-in
document.addEventListener('DOMContentLoaded', function() {

    const botonIniciarSesion = document.getElementById('login');

    botonIniciarSesion.addEventListener('click', function() {
        window.location.href = '/login/';
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const tienda = document.getElementById('categoria1');

    tienda.addEventListener('click', function() {
        window.location.href = '/tienda/';
    });
});

//carrito de compra
// Añadir producto al carrito
const agregarAlCarrito = async (productoId) => {
    try {
        const response = await fetch('/api/carrito/add', {  // Actualizado
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ productoId })
        });

        const result = await response.json();
        if (result.success) {
            mostrarNotificacion('Producto agregado al carrito');
            actualizarCarrito(); // Actualiza la lista de productos en el carrito
        } else {
            mostrarNotificacion(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        mostrarNotificacion('Error al agregar al carrito', 'error');
    }
};

// Mostrar notificación
const mostrarNotificacion = (mensaje, tipo = 'success') => {
    const notification = document.querySelector('.notification');
    notification.className = `notification ${tipo}`;
    notification.textContent = mensaje;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
};

// Actualizar el carrito
const actualizarCarrito = async () => {
    try {
        const response = await fetch('/api/carrito/getCarrito');  // Actualizado
        const result = await response.json();
        if (result.success) {
            const carritoList = document.getElementById('carritoList');
            carritoList.innerHTML = ''; // Limpiar la lista actual

            result.carrito.forEach(producto => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail" style="width: 50px; height: 50px;"/>
                    <span>${producto.nombre}</span>
                    <button class="btn btn-danger btn-sm" data-producto-id="${producto._id}">Eliminar</button>
                `;
                carritoList.appendChild(listItem);
            });

            // Agregar eventos de eliminación de productos
            carritoList.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const productoId = e.target.dataset.productoId;
                    try {
                        const response = await fetch(`/api/carrito/remove/${productoId}`, {  // Actualizado
                            method: 'DELETE'
                        });
                        const result = await response.json();
                        if (result.success) {
                            mostrarNotificacion('Producto eliminado del carrito');
                            actualizarCarrito(); // Actualiza la lista de productos en el carrito
                        } else {
                            mostrarNotificacion(result.message, 'error');
                        }
                    } catch (error) {
                        console.error('Error al eliminar del carrito:', error);
                        mostrarNotificacion('Error al eliminar del carrito', 'error');
                    }
                });
            });
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
    }
};

// Vaciar el carrito
const vaciarCarrito = async () => {
    try {
        const response = await fetch('/api/carrito/clear', {  // Actualizado
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            mostrarNotificacion('Carrito vaciado');
            actualizarCarrito(); // Actualiza la lista de productos en el carrito
        } else {
            mostrarNotificacion(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        mostrarNotificacion('Error al vaciar el carrito', 'error');
    }
};

// Evento de clic para los botones "Agregar al Carrito"
document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
    button.addEventListener('click', (e) => {
        const productoId = e.target.dataset.productoId;
        agregarAlCarrito(productoId);
    });
});

// Evento de clic para el botón "Vaciar Carrito"
document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});