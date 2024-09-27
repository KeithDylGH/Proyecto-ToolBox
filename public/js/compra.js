// compra.js

document.addEventListener('DOMContentLoaded', () => {
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const pagarMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const paypalBtn = document.getElementById('paypalBtn');
    const metodosPago = document.getElementById('metodosPago');

    // Mostrar los métodos de pago al hacer clic en "Siguiente"
    siguienteBtn.addEventListener('click', () => {
        metodosPago.classList.remove('d-none');
    });

    // Función para mostrar el modal de Pago Móvil
    pagarMovilBtn.addEventListener('click', () => {
        const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
        pagoMovilModal.show();
    });

    // Función para mostrar el modal de Transferencia
    transferenciaBtn.addEventListener('click', () => {
        const transferenciaModal = new bootstrap.Modal(document.getElementById('transferenciaModal'));
        transferenciaModal.show();
    });

    // Función para mostrar el modal de Zinli
    zinliBtn.addEventListener('click', () => {
        const zinliModal = new bootstrap.Modal(document.getElementById('zinliModal'));
        zinliModal.show();
    });

    // Función para mostrar el modal de PayPal
    paypalBtn.addEventListener('click', () => {
        const paypalModal = new bootstrap.Modal(document.getElementById('paypalModal'));
        paypalModal.show();
        // Renderizar botón de PayPal
        renderPayPalButton();
    });

    // Función para renderizar el botón de PayPal
    function renderPayPalButton() {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: document.getElementById('totalMonto').textContent.replace('$', '')
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Aquí puedes manejar el pago exitoso
                    console.log('Transaction completed by ' + details.payer.name.given);
                    // Enviar los detalles del pago al servidor
                    enviarDetallesPago(data.orderID, 'PayPal');
                });
            },
            onError: function(err) {
                console.error('Error en el proceso de PayPal:', err);
            }
        }).render('#paypal-button-container');
    }

    // Función para enviar los detalles del pago al servidor
    function enviarDetallesPago(orderId, metodoPago) {
        const productos = []; // Aquí puedes añadir la lógica para recoger los productos
        fetch('/confirmar-pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productos, metodo: metodoPago })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error al confirmar el pago:', data.error);
            } else {
                alert('Pago confirmado. ¡Gracias por su compra!');
                window.location.href = '/'; // Redirigir al inicio o a una página de éxito
            }
        })
        .catch(error => console.error('Error al enviar los detalles del pago:', error));
    }

    // Lógica para el formulario de Pago Móvil
    document.getElementById('pagoMovilForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Aquí puedes manejar la lógica de confirmación del pago móvil
        alert('Pago Móvil confirmado. ¡Gracias por su compra!');
        window.location.href = '/'; // Redirigir al inicio o a una página de éxito
    });

    // Lógica para el formulario de Transferencia
    document.getElementById('transferenciaForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Aquí puedes manejar la lógica de confirmación de la transferencia
        alert('Transferencia confirmada. ¡Gracias por su compra!');
        window.location.href = '/'; // Redirigir al inicio o a una página de éxito
    });

    // Lógica para el formulario de Zinli
    document.getElementById('zinliForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Aquí puedes manejar la lógica de confirmación de Zinli
        alert('Pago por Zinli confirmado. ¡Gracias por su compra!');
        window.location.href = '/'; // Redirigir al inicio o a una página de éxito
    });
});