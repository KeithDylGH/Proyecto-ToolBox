document.addEventListener('DOMContentLoaded', function () {
    // Obtén los elementos de la página
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');
    
    // Verifica si los elementos existen antes de agregar los eventos
    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            // Muestra los métodos de pago y oculta los botones
            metodosPago.classList.remove('d-none');
            siguienteBtn.style.display = 'none';
            cancelarBtn.style.display = 'none';
        });
    }

    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const paypalBtn = document.getElementById('paypalBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    // Verifica si los botones de métodos de pago existen antes de agregar los eventos
    if (pagoMovilBtn && paypalBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            // Muestra el modal para Pago Móvil
            const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
            pagoMovilModal.show();
        });

        paypalBtn.addEventListener('click', function () {
            // Redirige al usuario a la página de PayPal
            window.location.href = '/compra/paypal'; // Asegúrate de que esta URL es correcta
        });

        cancelarPagoBtn.addEventListener('click', function () {
            // Redirige al usuario a la página principal o una página de cancelación
            window.location.href = '/';
        });
    }
});