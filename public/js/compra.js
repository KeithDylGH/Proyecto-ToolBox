document.addEventListener('DOMContentLoaded', function () {
    const siguienteBtn = document.getElementById('siguienteBtn');
    const metodosPago = document.getElementById('metodosPago');

    siguienteBtn.addEventListener('click', function () {
        metodosPago.classList.remove('d-none');
        document.querySelector('.card').style.display = 'none'; // Ocultar la información del producto
    });

    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const paypalBtn = document.getElementById('paypalBtn');

    pagoMovilBtn.addEventListener('click', function () {
        const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
        pagoMovilModal.show();
    });

    paypalBtn.addEventListener('click', function () {
        // Redirigir al usuario a la página de PayPal o a la API de PayPal
        window.location.href = '/paypal'; // Cambia esta URL según la configuración de tu API de PayPal
    });
});