document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();

    // Función para agregar producto al carrito
    async function agregarAlCarrito(productoId, cantidad = 1) {
        try {
            const response = await fetch('/api/carrito/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productoId, cantidad })
            });
            const data = await response.json();

            if (data.success) {
                cargarCarrito();
                mostrarNotificacion('Producto agregado al carrito', 'success');
            } else {
                mostrarNotificacion('Error al agregar al carrito', 'error');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            mostrarNotificacion('Error al agregar al carrito', 'error');
        }
    }

    // Agregar producto al carrito desde los botones
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const productoId = this.getAttribute('data-producto-id');
            await agregarAlCarrito(productoId); // Llama a la función para agregar al carrito
            window.location.href = '/compra'; // Redirige a la página de compra
        });
    });

    // Función para manejar el botón de "Comprar"
    document.querySelectorAll('#comprarBtn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const productoId = this.getAttribute('data-producto-id');
            await agregarAlCarrito(productoId); // Llama a la función para agregar al carrito
            window.location.href = '/cuenta/carrito'; // Redirige a la página del carrito
        });
    });
    
    // Cargar el carrito
    async function cargarCarrito() {
        try {
            const response = await fetch('/api/carrito/getCarrito');
            const data = await response.json();

            if (data.success) {
                const carritoList = document.getElementById('carritoList');
                carritoList.innerHTML = '';
                let montoTotal = 0;

                if (data.carrito.length > 0) {
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

                    // Añadir event listener para eliminar producto
                    document.querySelectorAll('.btn-eliminar').forEach(btn => {
                        btn.addEventListener('click', async function() {
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

                    // Escuchar el clic en el botón de vaciar carrito
                    const botonVaciarCarrito = document.getElementById('vaciarCarrito');
                    if (botonVaciarCarrito) {
                        botonVaciarCarrito.addEventListener('click', async function() {
                            try {
                                const response = await fetch('/api/carrito/vaciar', {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                });
                                
                                const result = await response.json();
                                if (result.success) {
                                    mostrarNotificacion('Carrito vaciado', 'success');
                                    cargarCarrito(); // Actualiza el carrito en la interfaz
                                } else {
                                    mostrarNotificacion(result.message || 'Error al vaciar el carrito', 'error');
                                }
                            } catch (error) {
                                console.error('Error al vaciar el carrito:', error);
                                mostrarNotificacion('Error al vaciar el carrito', 'error');
                            }
                        });
                    }
                } else {
                    carritoList.innerHTML = '<li class="list-group-item">Tu carrito está vacío.</li>';
                }
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            mostrarNotificacion('Error al cargar el carrito', 'error');
        }
    }
});