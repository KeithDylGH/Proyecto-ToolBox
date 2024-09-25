// Asegúrate de que el script de PayPal esté cargado antes de ejecutar este código
document.addEventListener('DOMContentLoaded', function() {
    // Agregar el evento click al botón de PayPal
    document.getElementById('paypalBtn').addEventListener('click', function() {
        console.log('Botón de PayPal clickeado');
        let paypalModal = new bootstrap.Modal(document.getElementById('paypalModal'));
        paypalModal.show();

        // Renderiza el botón de PayPal
        paypal.Buttons({
            style: {
                shape: "rect",
                layout: "vertical",
                color: "gold",
                label: "paypal",
            },
            async createOrder() {
                try {
                    // Obtener los productos desde el contexto global
                    const productos = window.productos; // Accedemos a la variable global
                    let total = productos.reduce((total, p) => total + (p.precio * (p.cantidad || 1)), 0).toFixed(2);
                    console.log('Total a pagar:', total);

                    // Crear una descripción del pedido con detalles de los productos
                    const descripcionProductos = productos.map(p => `${p.nombre} (Cantidad: ${p.cantidad || 1}) - $${(p.precio * (p.cantidad || 1)).toFixed(2)}`).join(', ');

                    const response = await fetch("/api/orders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            total: total,
                            descripcion: descripcionProductos,
                            productos: productos // Enviamos los productos como parte del pedido
                        }),
                    });

                    const orderData = await response.json();

                    if (orderData.id) {
                        return orderData.id;
                    }
                    const errorDetail = orderData?.details?.[0];
                    const errorMessage = errorDetail
                        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                        : JSON.stringify(orderData);

                    throw new Error(errorMessage);
                } catch (error) {
                    console.error(error);
                    // mostrarNotificacion(`No se pudo iniciar el pago...<br><br>${error}`);
                }
            },
            async onApprove(data, actions) {
                try {
                    const response = await fetch(`/api/orders/${data.orderID}/capture`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const orderData = await response.json();
                    const errorDetail = orderData?.details?.[0];

                    if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                        return actions.restart();
                    } else if (errorDetail) {
                        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                    } else if (!orderData.purchase_units) {
                        throw new Error(JSON.stringify(orderData));
                    } else {
                        const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0] || orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                        alert(`Transacción ${transaction.status}: ${transaction.id}`);
                        console.log("Resultado de la captura", orderData);
                    }
                } catch (error) {
                    console.error(error);
                    alert(`Lo siento, no se pudo procesar tu transacción...<br><br>${error}`);
                }
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