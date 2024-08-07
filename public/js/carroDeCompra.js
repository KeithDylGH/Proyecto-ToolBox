document.addEventListener("DOMContentLoaded", () => {
    const carritoBtn = document.querySelectorAll('.agregar-carrito');
    const carritoItems = document.getElementById('carritoItems');
    let carrito = [];
  
    carritoBtn.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productoId = e.target.getAttribute('data-producto-id');
            try {
                // Corregir la ruta a /carrito/agregar
                const response = await fetch('/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productoId })
                });
    
                if (response.ok) {
                    const resultado = await response.json();
                    carrito.push(resultado.producto);
                    mostrarNotificacion('Producto agregado al carrito', 'success');
                    actualizarCarrito();
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
            carritoItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div>
                    <h5>${item.nombre}</h5>
                    <p>${item.precio}</p>
                </div>
            `;
            carritoItems.appendChild(carritoItem);
        });
    };
});