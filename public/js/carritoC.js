document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();

    async function cargarCarrito() {
        try {
            const response = await fetch('/api/carrito/getCarrito');
            const data = await response.json();

            if (data.success) {
                const carritoList = document.getElementById('carritoList');
                carritoList.innerHTML = '';

                data.carrito.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    
                    li.innerHTML = `
                        <div>
                            <img src="${item.imagen}" alt="${item.nombre}" class="img-thumbnail" style="width: 50px; height: 50px;">
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
                console.error('Error al cargar el carrito:', data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
});