document.addEventListener('DOMContentLoaded', function () {
    // Mostrar métodos de pago
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');
    const loader = document.getElementById('loader'); // Referencia al loader

    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            metodosPago.classList.remove('d-none');
            siguienteBtn.style.display = 'none';
            cancelarBtn.style.display = 'none';
        });
    }

    // Mostrar modales de métodos de pago
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
    const confirmarPagoForms = document.querySelectorAll('#pagoMovilForm, #transferenciaForm, #zinliForm');

    confirmarPagoForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
            // Mostrar el loader
            loader.classList.remove('d-none');

            // Capturar el método de pago desde el input oculto del formulario
            const metodoPagoInput = form.querySelector('input[name="metodoPago"]');
            if (!metodoPagoInput || !metodoPagoInput.value) {
                mostrarNotificacion('Método de pago no especificado.', 'danger');
                loader.classList.add('d-none'); // Ocultar el loader si hay un error
                return;
            }
            const metodoPago = metodoPagoInput.value;

            // Capturar los productos del carrito
            const productos = Array.from(document.querySelectorAll('.list-group-item.producto')).map(producto => {
                const id = producto.dataset.id;
                const nombre = producto.querySelector('.nombreProducto').textContent;
                const cantidad = parseInt(producto.querySelector('.cantidadProducto').textContent) || 1;
                const precio = parseFloat(producto.querySelector('.precioProducto').textContent) || 0;
                return { id, nombre, cantidad, precio };
            });

            if (!productos.length) {
                mostrarNotificacion('No hay productos en el carrito.', 'danger');
                loader.classList.add('d-none'); // Ocultar el loader si no hay productos
                return;
            }

            // Enviar la confirmación de pago al servidor
            fetch('/confirmar-pago-carrito', {
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
                loader.classList.add('d-none'); // Ocultar el loader cuando termine
                if (data.error) {
                    mostrarNotificacion(data.error, 'danger');
                } else {
                    mostrarNotificacion('Pago confirmado correctamente.', 'success');
                }
            })
            .catch(error => {
                loader.classList.add('d-none'); // Ocultar el loader si hay un error
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