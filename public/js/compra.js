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
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
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

        cancelarPagoBtn.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    // Confirmar el pago
    const confirmarPagoBtns = [document.getElementById('pagoMovilForm'), document.getElementById('transferenciaForm'), document.getElementById('zinliForm')];

    confirmarPagoBtns.forEach(form => {
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                const metodoPago = form.id === 'pagoMovilForm' ? 'Pago Móvil' : 
                                    form.id === 'transferenciaForm' ? 'Transferencia' : 'Zinli';

                const productoElemento = document.querySelector('.card-title');
                const producto = productoElemento ? productoElemento.textContent.trim() : 'Producto desconocido';

                const cantidadElemento = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Cantidad'));
                const cantidad = parseInt(cantidadElemento ? cantidadElemento.textContent.replace('Cantidad: ', '') : '1', 10);

                const totalElemento = document.getElementById('totalMonto');
                const total = parseFloat(totalElemento ? totalElemento.textContent.replace('Total: $', '') : '0').toFixed(2);

                const correoUsuario = document.getElementById('correoUsuario').value;

                console.log('Datos enviados:', {
                    correo: correoUsuario,
                    producto: producto,
                    precio: total,
                    cantidad: cantidad,
                    metodo: metodoPago
                });

                fetch('/confirmar-pago', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        correo: correoUsuario,
                        producto: producto,
                        precio: total,
                        cantidad: cantidad,
                        metodo: metodoPago
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    mostrarNotificacion('Pago confirmado correctamente. Se ha enviado un correo con la factura.');
                })
                .catch(error => {
                    console.error('Error al confirmar el pago:', error);
                    mostrarNotificacion('Hubo un error al confirmar el pago.');
                });
            });
        }
    });

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.textContent = mensaje;
        notificacion.style.position = 'fixed';
        notificacion.style.bottom = '20px';
        notificacion.style.right = '20px';
        notificacion.style.padding = '10px';
        notificacion.style.backgroundColor = '#28a745';
        notificacion.style.color = '#fff';
        notificacion.style.borderRadius = '5px';
        notificacion.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        document.body.appendChild(notificacion);
        setTimeout(() => {
            notificacion.remove();
        }, 5000);
    }
});