// Función para agregar producto al carrito
async function agregarAlCarrito(productoId) {
    try {
        const response = await fetch('/api/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productoId })
        });

        const data = await response.json();
        if (data.success) {
            mostrarNotificacion('Producto agregado al carrito', 'success');
            cargarCarrito();  // Recargar el carrito para mostrar los cambios
        } else {
            mostrarNotificacion(data.message, 'error');
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        mostrarNotificacion('Error al agregar producto al carrito', 'error');
    }
}

// Función para cargar el carrito en la página
async function cargarCarrito() {
    try {
        const response = await fetch('/api/carrito/getCarrito');
        const data = await response.json();

        if (data.success) {
            const carritoContainer = document.getElementById('carrito-container');
            carritoContainer.innerHTML = ''; // Limpiar el contenedor antes de actualizar

            data.carrito.forEach(producto => {
                carritoContainer.innerHTML += `
                    <div class="producto-carrito">
                        <img src="${producto.imagen}" alt="${producto.nombre}" />
                        <div class="detalles-producto">
                            <h4>${producto.nombre}</h4>
                            <p>Categoría: ${producto.categoria}</p>
                            <p>Cantidad: ${producto.cantidad}</p>
                        </div>
                        <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
                    </div>
                `;
            });
        } else {
            mostrarNotificacion(data.message, 'error');
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        mostrarNotificacion('Error al cargar el carrito', 'error');
    }
}

// Función para eliminar una unidad de un producto del carrito
async function eliminarProducto(productoId) {
    try {
        const response = await fetch(`/api/carrito/remove/${productoId}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
            mostrarNotificacion('Producto eliminado del carrito', 'success');
            cargarCarrito();  // Recargar el carrito para mostrar los cambios
        } else {
            mostrarNotificacion(data.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        mostrarNotificacion('Error al eliminar producto del carrito', 'error');
    }
}

// Función para vaciar el carrito
async function vaciarCarrito() {
    try {
        const response = await fetch('/api/carrito/vaciar', {
            method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
            mostrarNotificacion('Carrito vaciado', 'success');
            cargarCarrito();  // Recargar el carrito para mostrar los cambios
        } else {
            mostrarNotificacion(data.message, 'error');
        }
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        mostrarNotificacion('Error al vaciar el carrito', 'error');
    }
}

// Función para mostrar notificaciones en la página
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.classList.add('notificacion', tipo); // Añadir clase 'success' o 'error'
    notificacion.innerText = mensaje;

    document.body.appendChild(notificacion);

    // Eliminar la notificación después de unos segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Llamar a cargarCarrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);