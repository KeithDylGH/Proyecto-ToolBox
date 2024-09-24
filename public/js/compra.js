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

    // Confirmar pago con el botón de confirmar
    document.querySelector('#confirmarPagoBtn').addEventListener('click', (event) => {
        event.preventDefault();

        const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

        // Recolectar IDs de productos
        const productoIds = Array.from(document.querySelectorAll('.producto[data-id]')).map(producto => producto.dataset.id);

        console.log('Datos a enviar:', { productoIds, metodo: metodoPago });

        // Confirmar el pago
        fetch('/confirmar-pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productoIds: productoIds,
                metodo: metodoPago
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                mostrarNotificacion(data.error, 'danger');
            } else {
                mostrarNotificacion('Pago confirmado correctamente.', 'success');
                console.log('Respuesta del servidor:', data);
                // Redireccionar o limpiar el formulario si es necesario
            }
        })
        .catch(error => {
            mostrarNotificacion('Error al confirmar el pago.', 'danger');
            console.error('Error al confirmar el pago:', error);
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