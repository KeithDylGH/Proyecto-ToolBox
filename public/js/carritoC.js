document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito(); // Cargar el carrito al iniciar

    // Función para agregar un producto al carrito
    const agregarProductoAlCarrito = async (productoId, cantidad = 1) => {
        try {
            const response = await fetch('/api/carrito/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productoId,
                    cantidad,
                }),
                credentials: 'same-origin'
            });

            const result = await response.json();
            if (result.success) {
                mostrarNotificacion('Producto agregado al carrito', 'success');
                cargarCarrito(); // Actualiza el carrito en la interfaz
            } else {
                mostrarNotificacion(result.message || 'Error al agregar producto al carrito', 'error');
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            mostrarNotificacion('Error al agregar producto al carrito', 'error');
        }
    };

    // Función para vaciar el carrito
    const vaciarCarrito = async () => {
        try {
            const response = await fetch('/api/carrito/vaciar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            const result = await response.json();
            if (result.success) {
                mostrarNotificacion('Carrito vaciado exitosamente', 'success'); // Mostrar notificación
                cargarCarrito(); // Actualiza el carrito en la interfaz
            } else {
                mostrarNotificacion(result.message || 'Error al vaciar el carrito', 'error'); // Notificación de error
            }
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            mostrarNotificacion('Error al vaciar el carrito', 'error'); // Notificación de error
        }
    };

    // Escuchar el clic en el botón de vaciar carrito
    const botonVaciarCarrito = document.getElementById('vaciarCarrito');
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', async function () {
            // Primero, verifica si el carrito ya está vacío
            const carritoList = document.getElementById('carritoList');
            if (carritoList && carritoList.children.length === 0) {
                mostrarNotificacion('El carrito ya está vacío', 'warning'); // Notificación de advertencia
                return; // No hacer la solicitud si el carrito está vacío
            }

            // Si el carrito no está vacío, proceder a vaciarlo
            vaciarCarrito();
        });
    }

    // Función para cargar el carrito
    async function cargarCarrito() {
        console.log('Iniciando carga del carrito...'); // Log al iniciar la carga del carrito
        try {
            const response = await fetch('/api/carrito/getCarrito');
            const data = await response.json();

            const carritoList = document.getElementById('carritoList');
            carritoList.innerHTML = '';

            let montoTotal = 0;

            if (data.success && data.carrito.length > 0) {
                data.carrito.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                        <div class="d-flex align-items-center">
                            <a href="/tienda/producto/${item._id}" class="d-flex align-items-center text-decoration-none">
                                <img src="${item.imagen.data}" alt="${item.nombre}" class="img-thumbnail" style="width: 100px; height: 100px;">
                            </a>
                            <div class="ms-3">
                                <a href="/tienda/producto/${item._id}" class="text-dark text-decoration-none">
                                    <strong>${item.nombre}</strong>
                                </a>
                                - ${item.categoria}<br>
                                <span class="text-dark badge badge-primary badge-pill cantidad-texto">Cantidad: ${item.cantidad}</span><br>
                                <span>Precio unitario: $${item.precio}</span><br>
                                <span>Total: $${(item.precio * item.cantidad).toFixed(2)}</span>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-producto-id="${item._id}">Eliminar</button>
                    `;
                    carritoList.appendChild(li);

                    montoTotal += item.precio * item.cantidad;
                });

                const montoTotalElement = document.getElementById('totalMonto');
                if (montoTotalElement) {
                    montoTotalElement.textContent = `Monto Total: $${montoTotal.toFixed(2)}`;
                }

                agregarListenersEliminar(); // Agregar los listeners para eliminar productos
            } else {
                carritoList.innerHTML = '<li class="list-group-item">El carrito está vacío.</li>';
            }
        } catch (error) {
            console.error('Error al intentar cargar el carrito:', error); // Log de errores
        }
    }

    // Función para mostrar notificaciones
    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        const notification = document.querySelector('.notification');
        notification.className = `notification ${tipo}`;
        notification.textContent = mensaje;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    };

    // Función para agregar listeners a los botones de eliminar productos
    function agregarListenersEliminar() {
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', async function () {
                const productoId = this.getAttribute('data-producto-id');
                try {
                    const response = await fetch(`/api/carrito/remove/${productoId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin'
                    });

                    const result = await response.json();
                    if (result.success) {
                        mostrarNotificacion('Producto eliminado del carrito', 'success');
                        cargarCarrito(); // Actualiza el carrito en la interfaz
                    } else {
                        mostrarNotificacion(result.message || 'Error al eliminar producto del carrito', 'error');
                    }
                } catch (error) {
                    console.error('Error al eliminar producto del carrito:', error);
                    mostrarNotificacion('Error al eliminar producto del carrito', 'error');
                }
            });
        });
    }
});