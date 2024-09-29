document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito(); // Cargar el carrito al iniciar

    // Manejar la acción de agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
        button.addEventListener('click', async function() {
            const productoId = this.getAttribute('data-producto-id');
            const cantidad = 1;

            try {
                const response = await fetch('/api/carrito/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productoId, cantidad })
                });

                const result = await response.json();
                if (response.ok) {
                    showNotification('Producto añadido al carrito', 'success'); // Mostrar notificación
                    cargarCarrito(); // Actualiza el carrito en la interfaz
                } else {
                    showNotification('Error al añadir el producto al carrito', 'error'); // Notificación de error
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al añadir el producto al carrito', 'error'); // Notificación de error
            }
        });
    });

    // Manejar la acción de compra (este botón sí redirige)
    const comprarBtn = document.getElementById("comprarBtn");
    if (comprarBtn) {
        comprarBtn.addEventListener("click", async function(event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

            const productoId = this.getAttribute("data-producto-id");
            const cantidad = 1; // Cantidad que deseas añadir

            // Intentar añadir el producto al carrito y luego redirigir
            try {
                const response = await fetch("/api/carrito/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productoId, cantidad }),
                });

                if (response.ok) {
                    showNotification('Producto añadido al carrito', 'success'); // Mostrar notificación
                    setTimeout(() => {
                        window.location.href = "/cuenta/carrito";
                    }, 2000);
                } else {
                    showNotification("Error al añadir el producto al carrito.", "error"); // Notificación de error
                }
            } catch (error) {
                console.error("Error:", error);
                showNotification("Ocurrió un error al añadir el producto al carrito.", "error"); // Notificación de error
            }
        });
    }

    // Cargar el carrito
    async function cargarCarrito() {
        try {
            const response = await fetch('/api/carrito/getCarrito');
            const data = await response.json();

            if (data.success) {
                const carritoList = document.getElementById('carritoList');
                carritoList.innerHTML = '';

                let montoTotal = 0; // Variable para el monto total

                if (data.carrito.length > 0) {
                    data.carrito.forEach(item => {
                        console.log('Elemento del carrito:', item); // Depuración

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

                        // Acumulando el monto total
                        montoTotal += item.precio * item.cantidad;
                    });

                    // Mostrar monto total
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
                                    showNotification('Producto eliminado del carrito', 'success'); // Cambiar aquí
                                    cargarCarrito(); // Actualiza el carrito en la interfaz
                                } else {
                                    showNotification(result.message || 'Error al eliminar producto del carrito', 'error'); // Cambiar aquí
                                }
                            } catch (error) {
                                console.error('Error al eliminar producto del carrito:', error);
                                showNotification('Error al eliminar producto del carrito', 'error'); // Cambiar aquí
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
                                    showNotification('Carrito vaciado', 'success'); // Cambiar aquí
                                    cargarCarrito(); // Actualiza el carrito en la interfaz
                                } else {
                                    showNotification(result.message || 'Error al vaciar el carrito', 'error'); // Cambiar aquí
                                }
                            } catch (error) {
                                console.error('Error al vaciar el carrito:', error);
                                showNotification('Error al vaciar el carrito', 'error'); // Cambiar aquí
                            }
                        });
                    }
                } else {
                    // Si el carrito está vacío, mostrar un mensaje
                    carritoList.innerHTML = '<li class="list-group-item">Tu carrito está vacío.</li>';
                }
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            showNotification('Error al cargar el carrito', 'error'); // Cambiar aquí
        }
    }
});