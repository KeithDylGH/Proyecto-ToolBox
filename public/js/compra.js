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
    const paypalBtn = document.getElementById('paypalBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && paypalBtn && cancelarPagoBtn) {
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

        paypalBtn.addEventListener('click', function () {
            const paypalModal = new bootstrap.Modal(document.getElementById('paypalModal'));
            paypalModal.show();
        });
    }

    // Cálculo del total
    const totalMonto = document.getElementById('totalMonto');
    let total = 0;
    
    document.querySelectorAll('.producto').forEach(producto => {
        const precio = parseFloat(producto.querySelector('p').textContent.replace('Precio Unitario: $', ''));
        const cantidad = parseInt(producto.querySelector('p:nth-child(3)').textContent.replace('Cantidad: ', ''));
        total += precio * cantidad;
    });
    
    totalMonto.textContent = `Total: $${total.toFixed(2)}`;

    // Inicializar botones de PayPal
    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2) // Total a pagar
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Pago realizado con éxito: ' + details.id);
                    // Aquí puedes realizar una llamada a tu backend para confirmar el pago
                });
            },
            onError: function (err) {
                console.error(err);
                alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
            }
        }).render('#paypal-button-container'); // Dónde se renderiza el botón de PayPal
    }
});