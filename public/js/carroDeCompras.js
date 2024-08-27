document.addEventListener('DOMContentLoaded', () => {
    const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito');

    botonesAgregarCarrito.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            const productoId = event.target.dataset.productoid;
            const cantidad = 1; // O puedes permitir al usuario elegir la cantidad

            try {
                const response = await fetch('/api/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productoId, cantidad })
                });

                const resultado = await response.json();
                if (response.ok) {
                    alert('Producto agregado al carrito');
                } else {
                    alert('Error: ' + resultado.error);
                }
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
            }
        });
    });
});
