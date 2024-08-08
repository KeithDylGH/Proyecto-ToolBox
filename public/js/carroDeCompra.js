const agregarAlCarritoBtns = document.querySelectorAll('.agregar-al-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

agregarAlCarritoBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const productoId = btn.getAttribute('data-id');

        try {
            const response = await fetch('/carritos/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productoId })
            });

            if (response.ok) {
                // Notificar al usuario que el producto fue agregado al carrito
                alert('Producto agregado al carrito');
            } else {
                alert('Hubo un error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema con la solicitud');
        }
    });
});

// Función para vaciar el carrito
if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/carritos/vaciar', {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Carrito vaciado');
                // Puedes redirigir al usuario o recargar la página si es necesario
                window.location.reload();
            } else {
                alert('Hubo un error al vaciar el carrito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema con la solicitud');
        }
    });
}