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

            // Reemplaza esta lógica para obtener el email del usuario actual desde el servidor
            const emailUsuario = 'usuario@example.com'; 
            const producto = document.querySelector('.card-title').textContent;
            const total = document.getElementById('totalMonto').textContent.replace('Total: $', '');

            // Enviar confirmación de pago al servidor
            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailUsuario, // Reemplazar con el correo del usuario autenticado
                    producto: producto,
                    precio: parseFloat(total),
                    cantidad: 1, // Este valor puede cambiar según el caso
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

    // Función para mostrar notificaciones
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