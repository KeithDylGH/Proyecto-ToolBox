document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();

    // Agregar producto al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const productoId = this.getAttribute('data-producto-id');
            const cantidad = 1; // O el valor que determines

            try {
                const response = await fetch('/carrito/agregar', {
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
        });
    });

    // Cargar el carrito
    async function cargarCarrito() {
        try {
            const response = await fetch('/api/carrito/getCarrito');
            const data = await response.json();
    
            if (data.success) {
                const carritoList = document.getElementById('carritoList');
                carritoList.innerHTML = '';  // Limpiar la lista actual
    
                if (data.carrito.length > 0) {
                    data.carrito.forEach(item => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item d-flex justify-content-between align-items-center';
                        li.innerHTML = `
                            <div>
                                <img src="${item.imagen.data}" alt="${item.nombre}" class="img-thumbnail" style="width: 100px; height: 100px;">
                                <strong>${item.nombre}</strong> - ${item.categoria}
                            </div>
                            <span class="badge badge-primary badge-pill">Cantidad: ${item.cantidad}</span>
                            <span>Precio: $${item.precio}</span>
                            <form action="/carrito/eliminar/${item._id}" method="POST" style="display:inline;">
                                <button class="btn btn-danger btn-sm">Eliminar</button>
                            </form>
                        `;
                        carritoList.appendChild(li);
                    });
                } else {
                    carritoList.innerHTML = '<p>Tu carrito está vacío.</p>';  // Mostrar mensaje de carrito vacío
                }
            } else {
                console.error('Error al cargar el carrito:', data.message);
                mostrarNotificacion('Error al cargar el carrito', 'error');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            mostrarNotificacion('Error en la solicitud', 'error');
        }
    } 

    // Mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'}`;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
});