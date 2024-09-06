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
        console.log('Respuesta al agregar al carrito:', result);
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
        console.log('Respuesta al cargar carrito:', data);
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

// Mostrar carrito
function mostrarCarrito(carrito) {
    const carritoContainer = document.getElementById("carritoList");
    carritoContainer.innerHTML = '';
    carrito.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.classList.add('list-group-item');
        itemElement.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.imagen}" alt="${item.nombre}" class="img-thumbnail me-3" style="width: 80px; height: auto;" />
                <div>
                    <h5 class="mb-1 text-black">${item.nombre}</h5>
                    <p class="mb-1 text-black">${item.categoria}</p>
                    <p class="mb-1 text-black">Cantidad: ${item.cantidad}</p>
                </div>
            </div>
        `;
        carritoContainer.appendChild(itemElement);
    });
}