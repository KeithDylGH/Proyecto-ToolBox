document.addEventListener('DOMContentLoaded', function() {
    const siguienteBtn = document.getElementById('siguienteBtn');
    const metodosPago = document.getElementById('metodosPago');
    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const paypalBtn = document.getElementById('paypalBtn');

    siguienteBtn.addEventListener('click', function() {
        metodosPago.classList.remove('d-none');
    });

    pagoMovilBtn.addEventListener('click', function() {
        const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
        pagoMovilModal.show();
    });

    paypalBtn.addEventListener('click', function() {
        window.location.href = '/pago/paypal';
    });
});