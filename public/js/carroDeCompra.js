document.addEventListener("DOMContentLoaded", () => {
    const carritoBtn = document.querySelectorAll('.agregar-carrito');
    const carritoItems = document.getElementById('carritoItems');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoBtn.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productoId = e.target.getAttribute('data-producto-id');
            try {
                const response = await fetch('/api/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productoId })
                });
    
                if (response.ok) {
                    const resultado = await response.json();
                    if (resultado.producto) {
                        carrito.push(resultado.producto);
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        mostrarNotificacion('Producto agregado al carrito', 'success');
                        actualizarCarrito();
                    } else {
                        mostrarNotificacion('Error al agregar el producto al carrito', 'error');
                    }
                } else {
                    mostrarNotificacion('Error al agregar el producto al carrito', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
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

            const imagenSrc = item.imagen ? item.imagen : '/img/default.png'; 
            carritoItem.innerHTML = `
                <img src="${imagenSrc}" alt="${item.nombre || 'Producto'}">
                <div>
                    <h5>${item.nombre || 'Producto sin nombre'}</h5>
                    <p>$${item.precio || 'Precio no disponible'}</p>
                </div>
            `;
            carritoItems.appendChild(carritoItem);
        });
    };

    // Inicializar carrito en la carga de la página
    actualizarCarrito();

    // Manejar clic en el botón de vaciar carrito
    document.getElementById('vaciarCarrito').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/carrito/vaciar', {
                method: 'POST'
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
            console.error('Error:', error);
            mostrarNotificacion('Error al vaciar el carrito', 'error');
        }
    });
});