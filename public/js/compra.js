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

        paypalBtn.addEventListener('click', async () => {
            // Muestra el modal de PayPal
            const paypalModal = new bootstrap.Modal(document.getElementById('paypalModal'));
            paypalModal.show();

            // Llama a la función para crear la orden
            const totalCarrito = document.getElementById('totalMonto').innerText.replace('Total: $', '');
            
            const response = await fetch('/crear-orden', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ totalCarrito }),
            });

            const orderData = await response.json();

            if (response.ok) {
                paypal.Buttons({
                    createOrder: function(data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: totalCarrito
                                }
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            // Aquí puedes manejar el éxito de la transacción
                            alert('Transacción completada por ' + details.payer.name.given_name);
                            
                            // Captura la orden en tu backend
                            return fetch(`/capturar-orden/${data.orderID}`, {
                                method: 'POST'
                            });
                        });
                    },
                    onError: function (err) {
                        console.error(err);
                        alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
                    }
                }).render('#paypal-button-container');
            } else {
                alert('Error al crear la orden: ' + orderData.error);
            }
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
});