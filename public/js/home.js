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

// Escuchar el clic en los botones de agregar al carrito
document.addEventListener('DOMContentLoaded', function() {
    const botonesAgregarCarrito = document.querySelectorAll('.btn-agregar-carrito');
    botonesAgregarCarrito.forEach(boton => {
        boton.addEventListener('click', function() {
            const productoId = boton.getAttribute('data-producto-id');
            agregarAlCarrito(productoId);
        });
    });
});

// Función para agregar producto al carrito (ya definida)
const agregarAlCarrito = async (productoId) => {
    console.log('Producto ID:', productoId); // Log para verificar el producto
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
        console.log('Respuesta al agregar al carrito:', result);
        if (result.success) {
            mostrarNotificacion('Producto agregado al carrito');
            cargarCarrito(); // Actualiza el carrito en la interfaz
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
    console.log('Iniciando carga del carrito...'); // Log al iniciar la carga del carrito
    try {
        const response = await fetch('/api/carrito/getCarrito', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();
        console.log('Respuesta del servidor al cargar el carrito:', data); // Log de la respuesta del servidor
        if (response.ok) {
            mostrarCarrito(data.carrito);
        } else {
            console.error('Error al obtener el carrito:', data.message);
            if (data.message === 'No estás autenticado') {
                mostrarMensajeDeError('No estás autenticado. Por favor, inicia sesión para ver el carrito.');
            }
        }
    } catch (error) {
        console.error('Error al intentar cargar el carrito:', error); // Log de errores
    }
}

function mostrarMensajeDeError(mensaje) {
    const mensajeElemento = document.getElementById('mensaje-error');
    if (mensajeElemento) {
        mensajeElemento.textContent = mensaje;
        mensajeElemento.style.display = 'block';
    }
}

// Función para eliminar producto del carrito
const eliminarDelCarrito = async (productoId) => {
    console.log('Eliminando producto ID:', productoId); // Log del producto que se eliminará
    try {
        const response = await fetch(`/api/carrito/remove/${productoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin'
        });

        const result = await response.json();
        console.log('Respuesta al eliminar del carrito:', result);
        if (result.success) {
            mostrarNotificacion('Producto eliminado del carrito');
            cargarCarrito(); // Actualiza el carrito en la interfaz
        } else {
            mostrarNotificacion(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        mostrarNotificacion('Error al eliminar del carrito', 'error');
    }
};

// Mostrar carrito con opción para eliminar
function mostrarCarrito(carrito) {
    console.log('Mostrando carrito en la interfaz:', carrito); // Log de los productos que se muestran en el carrito
    const carritoContainer = document.getElementById("carritoList");
    carritoContainer.innerHTML = '';
    carrito.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.classList.add('list-group-item');
        itemElement.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.imagen.data}" alt="${item.nombre}" class="img-thumbnail me-3" style="width: 80px; height: auto;" />
                <div>
                    <h5 class="mb-1 text-black">${item.nombre}</h5>
                    <p class="mb-1 text-black">${item.categoria}</p>
                    <p class="mb-1 text-black">Cantidad: ${item.cantidad}</p>
                </div>
                <button class="btn btn-danger ms-auto btn-eliminar-producto" data-producto-id="${item._id}">X</button>
            </div>
        `;
        carritoContainer.appendChild(itemElement);
    });

    // Añadir evento para los botones de eliminar
    const botonesEliminar = document.querySelectorAll('.btn-eliminar-producto');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function() {
            const productoId = boton.getAttribute('data-producto-id');
            eliminarDelCarrito(productoId);
        });
    });
}