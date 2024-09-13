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

    // Confirmar pago
    const confirmarPagoBtns = document.querySelectorAll('#pagoMovilForm, #transferenciaForm, #zinliForm');

    confirmarPagoBtns.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const metodoPago = form.id === 'pagoMovilForm' ? 'Pago Móvil' : 
                               form.id === 'transferenciaForm' ? 'Transferencia' : 'Zinli';

            // Obtener el correo del usuario
            const metaUsuarioCorreo = document.querySelector('meta[name="usuario-correo"]');
            const emailUsuario = metaUsuarioCorreo ? metaUsuarioCorreo.getAttribute('content') : 'no-reply@example.com';

            // Obtener la información del producto
            const productoElemento = document.querySelector('.card-title');
            const producto = productoElemento ? productoElemento.textContent.trim() : 'Producto desconocido';

            // Obtener la cantidad
            const cantidadElemento = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Cantidad'));
            const cantidad = parseInt(cantidadElemento ? cantidadElemento.textContent.replace('Cantidad: ', '') : '1', 10);

            // Obtener el total
            const totalElemento = document.getElementById('totalMonto');
            const total = parseFloat(totalElemento ? totalElemento.textContent.replace('Total: $', '') : '0').toFixed(2);

            // Confirmar el pago
            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: emailUsuario,
                    producto: producto,
                    precio: total,
                    cantidad: cantidad,
                    metodo: metodoPago
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                mostrarNotificacion('Pago confirmado correctamente.', 'success');
                console.log('Respuesta del servidor:', data);
            })
            .catch(error => {
                mostrarNotificacion('Error al confirmar el pago.', 'danger');
                console.error('Error al confirmar el pago:', error);
            });                        
        });
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