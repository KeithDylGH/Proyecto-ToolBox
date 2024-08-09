const agregarAlCarrito = async (productoId) => {
    try {
        const response = await fetch('/carrito/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productoId })
        });

        const result = await response.json();
        if (result.success) {
            // Mostrar la estrella de like
            const likeEffect = document.getElementById('likeEffect');
            likeEffect.style.display = 'block'; // Mostrar el contenedor de la estrella

            // Ocultar la estrella después de la animación
            setTimeout(() => {
                likeEffect.style.display = 'none';
            }, 1000); // La duración de la animación en CSS es de 1 segundo

            const producto = result.producto;
            const item = document.createElement('li');
            item.classList.add('list-group-item', 'd-flex', 'align-items-center');
            item.dataset.productoId = producto._id;
            item.innerHTML = `
                <img src="${producto.imagen.data}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                <div>
                    <small class="font-weight-bold mb-2">${producto.nombre}</small>
                    <span class="text-muted">${producto.categoria}</span>
                    <button class="btn btn-danger btn-sm ms-2 btn-remove" data-producto-id="${producto._id}">Eliminar</button>
                </div>
            `;
            carritoItems.appendChild(item);

        } else {
            showAlert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al añadir producto al carrito');
    }
};

const eliminarDelCarrito = async (productoId) => {
    try {
        const response = await fetch('/carrito/remove-from-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productoId })
        });

        const result = await response.json();
        if (result.success) {
            const item = document.querySelector(`li[data-producto-id="${productoId}"]`);
            if (item) {
                item.remove();
            }
        } else {
            showAlert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al eliminar producto del carrito');
    }
};

const cargarCarrito = async () => {
    try {
        const response = await fetch('/carrito/get-cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            carritoItems.innerHTML = '';

            result.carrito.forEach(producto => {
                const item = document.createElement('li');
                item.classList.add('list-group-item', 'd-flex', 'align-items-center');
                item.dataset.productoId = producto._id;

                const imagenUrl = producto.imagen.data;

                item.innerHTML = `
                    <img src="${imagenUrl}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                    <div>
                        <h4 class="font-weight-bold mb-2">${producto.nombre}</h4>
                        <span class="text-muted">${producto.categoria}</span>
                        <button class="btn btn-danger btn-sm ms-2 btn-remove" data-producto-id="${producto._id}">Eliminar</button>
                    </div>
                `;

                carritoItems.appendChild(item);
            });

            document.querySelectorAll('.btn-remove').forEach(button => {
                button.addEventListener('click', async (event) => {
                    event.preventDefault();
                    const productoId = button.getAttribute('data-producto-id');
                    await eliminarDelCarrito(productoId);
                });
            });

        } else {
            showAlert('Error al cargar carrito: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al cargar carrito');
    }
};

document.getElementById('verCarrito').addEventListener('click', () => {
    cargarCarrito();
    const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
    carritoModal.show();
});

document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const productoId = this.getAttribute('data-producto-id');
        agregarAlCarrito(productoId);
    });
});


/* // Define la base URL de Bunny Storage
const bunnyBaseUrl = 'https://toolboxProject.b-cdn.net'; // Reemplaza esto con tu URL base de Bunny Storage

function getImageUrl(imagenPath) {
    return `${bunnyBaseUrl}/${imagenPath}`;
}

function agregarAlCarrito(productoId) {
    console.log({ productoId: String(productoId), cantidad: 1 }); // Verifica los datos enviados
    fetch('/api/carrito/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productoId: String(productoId), cantidad: 1 }),
    })
    .then(response => {
        console.log('Response status:', response.status); // Agrega esto para depurar
        return response.json();
    })
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

document.addEventListener('DOMContentLoaded', function() {
    const vaciarCarritoButton = document.getElementById('vaciarCarrito');
    if (vaciarCarritoButton) {
        vaciarCarritoButton.addEventListener('click', function() {
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
    }
});

// Cargar el carrito cuando se abre el modal
document.getElementById('carritoModal').addEventListener('show.bs.modal', cargarCarrito); */