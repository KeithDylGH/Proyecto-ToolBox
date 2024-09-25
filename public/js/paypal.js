// Asegúrate de que el script de PayPal esté cargado antes de ejecutar este código
document.addEventListener('DOMContentLoaded', function() {
    // Agregar el evento click al botón de PayPal
    document.getElementById('paypalBtn').addEventListener('click', function() {
        console.log('Botón de PayPal clickeado');
        let paypalModal = new bootstrap.Modal(document.getElementById('paypalModal'));
        paypalModal.show();

        // Renderiza el botón de PayPal
        paypal.Buttons({
            createOrder: function(data, actions) {
                // Obtener los productos desde el contexto global
                const productos = window.productos; // Accedemos a la variable global
                let total = productos.reduce((total, p) => total + (p.precio * (p.cantidad || 1)), 0).toFixed(2);
                console.log('Total a pagar:', total);

                // Crear una descripción del pedido con detalles de los productos
                const descripcionProductos = productos.map(p => `${p.nombre} (Cantidad: ${p.cantidad || 1}) - $${(p.precio * (p.cantidad || 1)).toFixed(2)}`).join(', ');

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total,
                            currency_code: 'USD'
                        },
                        description: descripcionProductos // Incluir la descripción de los productos
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Pago completado por ' + details.payer.name.given_name);
                    fetch('/confirmar-pago', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            productos: window.productos, // Enviar los productos globales
                            metodo: 'paypal',
                            detallesPago: details
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            mostrarNotificacion(data.error, 'danger');
                        } else {
                            mostrarNotificacion('Pago confirmado correctamente.', 'success');
                        }
                    })
                    .catch(error => {
                        mostrarNotificacion('Error al confirmar el pago.', 'danger');
                        console.error('Error al confirmar el pago:', error);
                    });
                });
            },
            onCancel: function(data) {
                alert('Pago cancelado.');
            },
            onError: function(err) {
                console.error('Error en el pago:', err);
            }
        }).render('#paypal-button-container'); // Renderizar el botón de PayPal en el contenedor
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