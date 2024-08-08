document.addEventListener("DOMContentLoaded", () => {
    const carritoBtn = document.querySelectorAll('.agregar-carrito');
    const carritoItems = document.getElementById('carritoItems');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoBtn.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productoId = e.target.getAttribute('data-producto-id');
            try {
                const response = await axios.post('/api/carrito/agregar', { productoId }, {
                    withCredentials: true
                });
    
                if (response.status === 200) {
                    const resultado = response.data;
                    if (resultado.producto) {
                        const itemIndex = carrito.findIndex(item => item._id === resultado.producto._id);
                        if (itemIndex !== -1) {
                            carrito[itemIndex].cantidad += 1; // Incrementar cantidad
                        } else {
                            resultado.producto.cantidad = 1; // Inicializar cantidad
                            carrito.push(resultado.producto);
                        }
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        mostrarNotificacion('Producto agregado al carrito', 'success');
                        actualizarCarrito();
                    } else {
                        mostrarNotificacion('Error al agregar el producto al carrito', 'error');
                    }
                } else if (response.status === 401) {
                    mostrarNotificacion('Usuario no autenticado. Por favor, inicia sesión.', 'error');
                } else {
                    mostrarNotificacion('Error al agregar el producto al carrito', 'error');
                }
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error.response ? error.response.data : error.message);
                mostrarNotificacion('Error al agregar el producto al carrito', 'error');
            }
        });
    });    

    const mostrarNotificacion = (mensaje, tipo) => {
        const notificacion = document.querySelector('.notification');
        notificacion.innerText = mensaje;
        notificacion.className = `notification ${tipo}`;
        notificacion.style.display = 'block';
        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 3000);
    };

    const actualizarCarrito = () => {
        carritoItems.innerHTML = '';
        carrito.forEach(item => {
            const carritoItem = document.createElement('div');
            carritoItem.classList.add('carrito-item');

            const imagenSrc = item.imagen || '/img/default.png';
            carritoItem.innerHTML = `
                <img src="${imagenSrc}" alt="${item.nombre || 'Producto'}">
                <div>
                    <h5>${item.nombre || 'Producto sin nombre'}</h5>
                    <p>$${item.precio || 'Precio no disponible'} x ${item.cantidad || 1}</p>
                </div>
            `;
            carritoItems.appendChild(carritoItem);
        });
    };

    actualizarCarrito();

    document.getElementById('vaciarCarrito').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/carrito/vaciar', {
                method: 'POST',
                credentials: 'include' // Añade esta línea para asegurar que las cookies se envíen
            });

            if (response.ok) {
                localStorage.removeItem('carrito');
                carrito = [];
                actualizarCarrito();
                mostrarNotificacion('Carrito vaciado', 'success');
            } else {
                mostrarNotificacion('Error al vaciar el carrito', 'error');
            }
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            mostrarNotificacion('Error al vaciar el carrito', 'error');
        }
    });
});