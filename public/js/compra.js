document.addEventListener('DOMContentLoaded', function () {
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');
    const card = document.querySelector('.card');

    siguienteBtn.addEventListener('click', function () {
        metodosPago.classList.remove('d-none');
        card.style.display = 'none'; // Ocultar la información del producto
        siguienteBtn.style.display = 'none'; // Ocultar el botón "Siguiente"
        cancelarBtn.style.display = 'none'; // Ocultar el botón "Cancelar"
    });

    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const paypalBtn = document.getElementById('paypalBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    pagoMovilBtn.addEventListener('click', function () {
        const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
        pagoMovilModal.show();
    });

    paypalBtn.addEventListener('click', function () {
        // Redirigir al usuario a la página de PayPal o a la API de PayPal
        window.location.href = '/paypal'; // Cambia esta URL según la configuración de tu API de PayPal
    });

    cancelarPagoBtn.addEventListener('click', function () {
        window.location.href = '/'; // Redirige al usuario a la página principal o a otra página de cancelación
    });
});