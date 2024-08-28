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
        const response = await fetch('/carrito/add', {
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
              <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                <div>
                    <small class="font-weight-bold mb-2">${producto.nombre}</small>
                    <span class="text-muted">${producto.categoria}</span>
                    <button class="btn btn-danger btn-sm ms-2 btn-remove" data-producto-id="${producto._id}">Eliminar</button>
                </div>
            `;
            carritoList.appendChild(item);

        } else {
            showAlert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al añadir producto al carrito');
    }
};

// Eliminar producto del carrito
const eliminarDelCarrito = async (productoId) => {
    try {
        const response = await fetch(`/carrito/remove/${productoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
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

// Cargar productos del carrito
const cargarCarrito = async () => {
    try {
        const response = await fetch('/carrito/getCarrito', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            carritoList.innerHTML = '';

            result.carrito.forEach(producto => {
                const item = document.createElement('li');
                item.classList.add('list-group-item', 'd-flex', 'align-items-center');
                item.dataset.productoId = producto._id;

                const imagenUrl = producto.imagen; // Asegúrate de que producto.imagen sea una URL válida

                item.innerHTML = `
                    <img src="${imagenUrl}" alt="${producto.nombre}" class="img-fluid me-3" style="width: 100px; height: auto;">
                    <div>
                        <h4 class="font-weight-bold mb-2">${producto.nombre}</h4>
                        <span class="text-muted">${producto.categoria}</span>
                        <button class="btn btn-danger btn-sm ms-2 btn-remove" data-producto-id="${producto._id}">Eliminar</button>
                    </div>
                `;

                carritoList.appendChild(item);
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

// Evento para abrir el modal y cargar el carrito
document.getElementById('verCarrito').addEventListener('click', () => {
    cargarCarrito();
    carritoModal.show();
});