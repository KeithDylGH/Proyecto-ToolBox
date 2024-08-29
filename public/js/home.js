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
        const response = await fetch('/api/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ productoId }),
            credentials: 'same-origin' // Asegura que las cookies de sesión se envíen con la solicitud
        });

        const result = await response.json();
        if (result.success) {
            mostrarNotificacion('Producto agregado al carrito');
            actualizarCarrito();
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
document.addEventListener("DOMContentLoaded", () => {
    // Cargar productos en el carrito al iniciar la página
    cargarCarrito();
});

async function cargarCarrito() {
    try {
        const response = await fetch('/api/carrito/getCarrito', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Importante para enviar cookies de sesión
        });

        const data = await response.json();
        if (response.ok) {
            mostrarCarrito(data.carrito);
        } else {
            console.error('Error al obtener el carrito:', data.message);
            // Maneja el caso de no autenticado sin redirigir
            if (data.message === 'No estás autenticado') {
                console.warn('Usuario no autenticado. Por favor, inicia sesión para ver el carrito.');
                // Opcional: puedes mostrar un mensaje en la interfaz indicando al usuario que no está autenticado
                mostrarMensajeDeError('No estás autenticado. Por favor, inicia sesión para ver el carrito.');
            }
        }
    } catch (error) {
        console.error('Error al intentar cargar el carrito:', error);
    }
}

// Función opcional para mostrar un mensaje de error en la interfaz
function mostrarMensajeDeError(mensaje) {
    const mensajeElemento = document.getElementById('mensaje-error');
    if (mensajeElemento) {
        mensajeElemento.textContent = mensaje;
        mensajeElemento.style.display = 'block';
    }
}

function mostrarCarrito(carrito) {
    const carritoContainer = document.getElementById("carritoList");
    carritoContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar los productos

    carrito.forEach(producto => {
        const productoElement = document.createElement("div");
        productoElement.classList.add("producto");
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" />
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <button onclick="eliminarDelCarrito('${producto._id}')">Eliminar</button>
        `;
        carritoContainer.appendChild(productoElement);
    });
}

async function eliminarDelCarrito(productoId) {
    try {
        const response = await fetch(`/api/carrito/remove/${productoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Importante para enviar cookies de sesión
        });

        const data = await response.json();
        if (response.ok) {
            alert('Producto eliminado del carrito');
            cargarCarrito(); // Actualizar el carrito después de eliminar un producto
        } else {
            console.error('Error al eliminar del carrito:', data.message);
        }
    } catch (error) {
        console.error('Error de red al intentar eliminar del carrito:', error);
    }
}

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