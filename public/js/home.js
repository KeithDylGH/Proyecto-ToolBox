// Entrar a la página Log-in
document.addEventListener('DOMContentLoaded', function() {
    const botonIniciarSesion = document.getElementById('login');
    if (botonIniciarSesion) {
        botonIniciarSesion.addEventListener('click', function() {
            window.location.href = '/login/';
        });
    }

    const tienda = document.getElementById('categoria1');
    if (tienda) {
        tienda.addEventListener('click', function() {
            window.location.href = '/tienda/';
        });
    }
});

// Agregar producto al carrito
const agregarAlCarrito = async (productoId) => {
    try {
        const response = await fetch('/api/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ productoId }),
            credentials: 'same-origin'
        });

        const result = await response.json();
        if (result.success) {
            mostrarNotificacion('Producto agregado al carrito');
            cargarCarrito();
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

// Cargar productos en el carrito al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
});

async function cargarCarrito() {
    try {
        const response = await fetch('/api/carrito/getCarrito', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            mostrarCarrito(data.carrito);
        } else {
            console.error('Error al obtener el carrito:', data.message);
            if (data.message === 'No estás autenticado') {
                mostrarMensajeDeError('No estás autenticado. Por favor, inicia sesión para ver el carrito.');
            }
        }
    } catch (error) {
        console.error('Error al intentar cargar el carrito:', error);
    }
}

function mostrarMensajeDeError(mensaje) {
    const mensajeElemento = document.getElementById('mensaje-error');
    if (mensajeElemento) {
        mensajeElemento.textContent = mensaje;
        mensajeElemento.style.display = 'block';
    }
}

function mostrarCarrito(carrito) {
    const carritoContainer = document.getElementById("carritoList");
    carritoContainer.innerHTML = "";

    carrito.forEach(producto => {
        const productoElement = document.createElement("li");
        productoElement.classList.add("list-group-item");
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;" />
            <h5>${producto.nombre}</h5>
            <p>Categoría: ${producto.categoria}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button class="btn btn-danger" onclick="eliminarDelCarrito('${producto._id}')">Eliminar</button>
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
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            mostrarNotificacion('Producto eliminado del carrito');
            cargarCarrito();
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
        const response = await fetch('/api/carrito/clear', {
            method: 'DELETE',
            credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
            mostrarNotificacion('Carrito vaciado');
            cargarCarrito();
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
const botonVaciarCarrito = document.getElementById('vaciarCarrito');
if (botonVaciarCarrito) {
    botonVaciarCarrito.addEventListener('click', vaciarCarrito);
}