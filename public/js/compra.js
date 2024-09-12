document.addEventListener('DOMContentLoaded', function () {
    // Botones y elementos comunes
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');

    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            // Muestra los métodos de pago y oculta los botones
            metodosPago.classList.remove('d-none');
            siguienteBtn.style.display = 'none';
            cancelarBtn.style.display = 'none';
        });
    }

    // Métodos de pago
    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            // Muestra el modal para Pago Móvil
            const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
            pagoMovilModal.show();
        });

        transferenciaBtn.addEventListener('click', function () {
            // Muestra el modal para Transferencia
            const transferenciaModal = new bootstrap.Modal(document.getElementById('transferenciaModal'));
            transferenciaModal.show();
        });

        zinliBtn.addEventListener('click', function () {
            // Muestra el modal para Zinli
            const zinliModal = new bootstrap.Modal(document.getElementById('zinliModal'));
            zinliModal.show();
        });

        cancelarPagoBtn.addEventListener('click', function () {
            // Redirige al usuario a la página principal
            window.location.href = '/';
        });
    }

    const confirmarPagoBtn = document.getElementById('confirmarPagoBtn');
    
    if (confirmarPagoBtn) {
        confirmarPagoBtn.addEventListener('click', function () {
            // Simulación de una solicitud de pago
            const pagoExitoso = true; // Cambiar a falso para probar el error

            if (pagoExitoso) {
                mostrarNotificacion('Pago realizado con éxito.', 'success');
            } else {
                mostrarNotificacion('Hubo un error al realizar el pago.', 'danger');
            }
        });
    }

    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `alert alert-${tipo}`;
        notificacion.textContent = mensaje;

        // Insertar notificación en la parte superior
        document.body.prepend(notificacion);

        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
});