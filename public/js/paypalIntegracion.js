// paypalIntegracion.js
window.paypal
    .Buttons({
        style: {
            shape: "rect",
            layout: "horizontal",
            color: "blue",
            label: "paypal",
        },

        async createOrder() {
            try {
                // Obtener la información del carrito desde la página
                const cartItems = Array.from(document.querySelectorAll('.producto'));
                const cart = cartItems.map(item => ({
                    id: item.getAttribute('data-id'), // ID del producto
                    quantity: parseInt(item.querySelector('p:nth-child(3)').textContent.split(': ')[1]) // Cantidad del producto
                }));

                // Calcular el total
                const totalAmount = cartItems.reduce((total, item) => {
                    const price = parseFloat(item.querySelector('p:nth-child(2)').textContent.split(': $')[1]);
                    const quantity = parseInt(item.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
                    return total + (price * quantity);
                }, 0).toFixed(2); // Total en formato decimal

                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart: cart,
                        total: totalAmount // Enviamos el total calculado
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
                console.error("Error al crear la orden:", error);
                alert("No se pudo iniciar el pago. Intenta de nuevo.");
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
                    return actions.restart(); // Retry
                } else if (errorDetail) {
                    throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                } else if (!orderData.purchase_units) {
                    throw new Error(JSON.stringify(orderData));
                } else {
                    const transaction =
                        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

                    // Mostrar mensaje de éxito
                    console.log(`Transacción ${transaction.status}: ${transaction.id}`);
                    alert(`Pago exitoso! Transacción ID: ${transaction.id}`);
                    // Aquí puedes redirigir o mostrar un mensaje de éxito
                }
            } catch (error) {
                console.error("Error al capturar la orden:", error);
                alert("Error en la captura del pago. Por favor intenta de nuevo.");
            }
        },
    })
    .render("#paypal-button-container");