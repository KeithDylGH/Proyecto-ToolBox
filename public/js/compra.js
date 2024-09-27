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
    const modalButtons = {
        pagoMovilBtn: 'pagoMovilModal',
        transferenciaBtn: 'transferenciaModal',
        zinliBtn: 'zinliModal',
        paypalBtn: 'paypalModal',
        cancelarPagoBtn: null // Manejo especial
    };

    Object.keys(modalButtons).forEach(key => {
        const button = document.getElementById(key);
        if (button) {
            button.addEventListener('click', () => {
                if (modalButtons[key]) {
                    mostrarModal(modalButtons[key]);
                } else {
                    window.location.href = '/';
                }
            });
        }
    });

    // Confirmar pago
    const confirmarPagoBtns = document.querySelectorAll('#pagoMovilForm, #transferenciaForm, #zinliForm');

    confirmarPagoBtns.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Deshabilitar el botón de envío

            // Cerrar el modal antes de mostrar el loader
            const modalElement = bootstrap.Modal.getInstance(form.closest('.modal'));
            if (modalElement) {
                modalElement.hide();
            }

            // Mostrar el loader
            const loader = document.getElementById('loader');
            loader.classList.remove('d-none');

            // Capturar el método de pago
            const metodoPagoInput = form.querySelector('input[name="metodoPago"]');
            const metodoPago = metodoPagoInput ? metodoPagoInput.value : null;

            // Capturar los productos
            const productos = Array.from(document.querySelectorAll('.list-group-item.producto')).map(producto => {
                const id = producto.dataset.id;
                const nombre = producto.querySelector('h6').textContent;
                const cantidad = producto.querySelector('.cantidad') ? producto.querySelector('.cantidad').textContent : 1;
                return { id, nombre, cantidad };
            });

            if (!productos.length) {
                mostrarNotificacion('No hay productos en el carrito.', 'danger');
                loader.classList.add('d-none'); // Ocultar el loader
                submitButton.disabled = false; // Habilitar el botón nuevamente
                return;
            }

            // Enviar la confirmación de pago
            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productos, metodo: metodoPago }),
            })
            .then(response => {
                loader.classList.add('d-none'); // Ocultar el loader
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.error || 'Error en el servidor');
                    });
                }
                return response.json();
            })
            .then(data => {
                mostrarNotificacion('Pago confirmado correctamente.', 'success');
                const modal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
                modal.show();
                // Redirigir después de 3 segundos
                setTimeout(() => window.location.href = '/', 3000);
            })
            .catch(error => {
                mostrarNotificacion('Error al confirmar el pago: ' + error.message, 'danger');
                console.error('Error al confirmar el pago:', error);
            })
            .finally(() => {
                submitButton.disabled = false; // Asegúrate de habilitar el botón nuevamente
            });
        });
    });

    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `alert alert-${tipo}`;
        notificacion.textContent = mensaje;

        document.body.prepend(notificacion);
        setTimeout(() => notificacion.remove(), 3000);
    }

    // Inicializar botones de PayPal
    initPaypalButtons();
});

function initPaypalButtons() {
    const totalElement = document.getElementById('totalMonto');
    const total = parseFloat(totalElement.textContent.replace('$', '').replace(',', '').trim());

    if (isNaN(total) || total <= 0) {
        console.warn('Total inválido:', total);
        const buttonContainer = document.getElementById('paypal-button-container');
        buttonContainer.innerHTML = ''; 
        const disabledButton = document.createElement('button');
        disabledButton.textContent = 'Pagar con PayPal';
        disabledButton.className = 'btn btn-secondary'; 
        disabledButton.disabled = true;
        disabledButton.title = 'Esperando monto de cotización';
        disabledButton.style.cursor = 'not-allowed'; 
        buttonContainer.appendChild(disabledButton);
    } else {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return fetch('/paypal/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: total.toFixed(2) })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al crear la orden');
                    }
                    return response.json();
                })
                .then(data => data.orderID);
            },
            onApprove: function(data, actions) {
                return fetch(`/paypal/payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orderID: data.orderID })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    const modal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
                    modal.show();
                })
                .catch(error => {
                    console.error('Error al completar el pago:', error);
                    alert('Ocurrió un error durante el pago con PayPal.');
                });
            }
        }).render('#paypal-button-container');
    }
}