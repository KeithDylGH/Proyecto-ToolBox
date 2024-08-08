// Define la base URL de Bunny Storage
const bunnyBaseUrl = `https://${process.env.bunnyNetPullZone}`;

// Función para construir la URL completa de la imagen
function getImageUrl(imagenPath) {
    return `${bunnyBaseUrl}/${imagenPath}`;
}

function agregarAlCarrito(productoId) {
    fetch('/api/carrito/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productoId, cantidad: 1 }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto agregado al carrito');
        } else {
            alert('Error al agregar producto al carrito');
        }
    })
    .catch(error => console.error('Error:', error));
}

function cargarCarrito() {
    fetch('/api/carrito')
    .then(response => response.json())
    .then(data => {
        const carritoItems = document.getElementById('carritoItems');
        carritoItems.innerHTML = '';

        if (data.productos.length === 0) {
            carritoItems.innerHTML = '<p>No hay productos en el carrito</p>';
        } else {
            data.productos.forEach(item => {
                const producto = item.productoId;
                const imagenUrl = getImageUrl(producto.imagenPath); // Construir la URL de la imagen
                const productoHtml = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${imagenUrl}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover;" class="me-3">
                            <div>
                                <h6>${producto.nombre}</h6>
                                <p>Cantidad: ${item.cantidad}</p>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${producto._id}')">Eliminar</button>
                    </div>
                    <hr>
                `;
                carritoItems.insertAdjacentHTML('beforeend', productoHtml);
            });
        }
    });
}

function eliminarDelCarrito(productoId) {
    fetch('/api/carrito/eliminar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productoId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarCarrito();
        } else {
            alert('Error al eliminar producto del carrito');
        }
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('vaciarCarrito').addEventListener('click', function() {
    fetch('/api/carrito/vaciar', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarCarrito();
        } else {
            alert('Error al vaciar el carrito');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Cargar el carrito cuando se abre el modal
document.getElementById('carritoModal').addEventListener('show.bs.modal', cargarCarrito);