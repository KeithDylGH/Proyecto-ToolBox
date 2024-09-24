document.addEventListener('DOMContentLoaded', function () {
    // Mostrar métodos de pago
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');

    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            metodosPago.classList.remove('d-none');
            siguienteBtn.style.display = 'none';
            cancelarBtn.style.display = 'none';
        });
    }

    // Mostrar modales
    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
            pagoMovilModal.show();
        });

        transferenciaBtn.addEventListener('click', function () {
            const transferenciaModal = new bootstrap.Modal(document.getElementById('transferenciaModal'));
            transferenciaModal.show();
        });

        zinliBtn.addEventListener('click', function () {
            const zinliModal = new bootstrap.Modal(document.getElementById('zinliModal'));
            zinliModal.show();
        });

        cancelarPagoBtn.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    // Confirmar pago
    const confirmarPagoBtns = document.querySelectorAll('#pagoMovilForm, #transferenciaForm, #zinliForm');

    confirmarPagoBtns.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Capturar el método de pago desde el input oculto del formulario
            const metodoPagoInput = form.querySelector('input[name="metodoPago"]');
            if (!metodoPagoInput || !metodoPagoInput.value) {
                mostrarNotificacion('Método de pago no especificado.', 'danger');
                return;
            }
            const metodoPago = metodoPagoInput.value;

            // Lógica para productos en carrito
            const productosEnCarrito = Array.from(document.querySelectorAll('.list-group-item.producto')).map(producto => {
                const id = producto.dataset.id;
                const nombre = producto.querySelector('h6').textContent; // Ajusta según tu HTML
                const cantidad = producto.querySelector('.cantidad') ? producto.querySelector('.cantidad').textContent : 1;
                return { id, nombre, cantidad };
            });

            // Lógica para producto individual
            const productoIndividual = document.querySelector('.producto-individual');
            let productos = [];

            if (productosEnCarrito.length) {
                // Si hay productos en el carrito, utilizarlos
                productos = productosEnCarrito;
            } else if (productoIndividual) {
                // Si hay un producto individual, capturar su información
                const id = productoIndividual.dataset.id;
                const nombre = productoIndividual.querySelector('h6').textContent; // Ajusta según tu HTML
                const cantidad = 1; // Puedes ajustar esto según el HTML de tu producto individual
                productos.push({ id, nombre, cantidad });
            }

            if (!productos.length) {
                mostrarNotificacion('No hay productos para procesar.', 'danger');
                return;
            }

            // Enviar la confirmación de pago al servidor
            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productos,
                    metodo: metodoPago // Enviar el método de pago
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    mostrarNotificacion(data.error, 'danger');
                } else {
                    mostrarNotificacion('Pago confirmado correctamente.', 'success');
                    console.log('Respuesta del servidor:', data);
                }
            })
            .catch(error => {
                mostrarNotificacion('Error al confirmar el pago.', 'danger');
                console.error('Error al confirmar el pago:', error);
            });
        });
    });

    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `alert alert-${tipo}`;
        notificacion.textContent = mensaje;

        document.body.prepend(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
});