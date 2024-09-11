document.addEventListener('DOMContentLoaded', function () {
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

    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const paypalBtn = document.getElementById('paypalBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && paypalBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
            pagoMovilModal.show();
        });

        paypalBtn.addEventListener('click', function () {
            window.location.href = '/compra/paypal';
        });

        cancelarPagoBtn.addEventListener('click', function () {
            window.location.href = '/';
        });
    }
});