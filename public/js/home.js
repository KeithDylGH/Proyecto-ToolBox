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

// Función para agregar un producto al carrito
async function agregarAlCarrito(productoId) {
    try {
        const response = await fetch('/api/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productoId })
        });

        const result = await response.json();
        
        if (result.success) {
            window.location.href = `?success=${encodeURIComponent('Producto agregado al carrito exitosamente')}`;
        } else {
            window.location.href = `?error=${encodeURIComponent('Error al agregar el producto al carrito')}`;
        }
    } catch (error) {
        window.location.href = `?error=${encodeURIComponent('Error al agregar el producto al carrito')}`;
    }
}

// Asociar la función al evento click del botón
document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
    button.addEventListener('click', () => {
        const productoId = button.getAttribute('data-producto-id');
        agregarAlCarrito(productoId);
    });
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

function mostrarCarrito(carrito) {
    const carritoContainer = document.getElementById("carritoList");
    carritoContainer.innerHTML = '';
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('carrito-item');
        itemElement.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" />
            <p>${item.nombre}</p>
            <p>${item.categoria}</p>
            <p>Cantidad: ${item.cantidad}</p>
        `;
        carritoContainer.appendChild(itemElement);
    });
}