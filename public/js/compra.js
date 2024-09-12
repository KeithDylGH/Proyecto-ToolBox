document.addEventListener('DOMContentLoaded', function () {
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');

    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            metodosPago.classList.remove('d-none'); // Mostrar los métodos de pago
            siguienteBtn.style.display = 'none';    // Ocultar el botón "Siguiente"
            cancelarBtn.style.display = 'none';     // Ocultar el botón "Cancelar"
        });
    }

    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
            pagoMovilModal.show(); // Mostrar el modal de Pago Móvil
        });

        transferenciaBtn.addEventListener('click', function () {
            const transferenciaModal = new bootstrap.Modal(document.getElementById('transferenciaModal'));
            transferenciaModal.show(); // Mostrar el modal de Transferencia
        });

        zinliBtn.addEventListener('click', function () {
            const zinliModal = new bootstrap.Modal(document.getElementById('zinliModal'));
            zinliModal.show(); // Mostrar el modal de Zinli
        });

        cancelarPagoBtn.addEventListener('click', function () {
            window.location.href = '/'; // Redirigir a la página principal
        });
    }

    // Confirmar pago para diferentes métodos
    const confirmarPagoBtns = document.querySelectorAll('#pagoMovilForm, #transferenciaForm, #zinliForm');

    confirmarPagoBtns.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const metodoPago = form.id === 'pagoMovilForm' ? 'Pago Móvil' : 
                               form.id === 'transferenciaForm' ? 'Transferencia' : 'Zinli';

            const emailUsuario = 'usuario@example.com'; // Asegúrate de que aquí también uses 'correo'
            const producto = document.querySelector('.card-title').textContent;

            // Buscar el elemento que contiene la cantidad
            const cantidadElemento = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Cantidad'));
            const cantidad = parseInt(cantidadElemento ? cantidadElemento.textContent.replace('Cantidad: ', '') : '1', 10);

            const total = parseFloat(document.getElementById('totalMonto').textContent.replace('Total: $', ''));

            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: emailUsuario, // Asegúrate de que aquí también uses 'correo'
                    producto: producto,
                    precio: total,
                    cantidad: cantidad,
                    metodo: metodoPago
                }),
            })
            .then(response => response.json())
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
        }, 3000); // Ocultar la notificación después de 3 segundos
    }
});