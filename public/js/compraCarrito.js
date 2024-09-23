document.addEventListener('DOMContentLoaded', function () {
    // Mostrar métodos de pago
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');

    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar reiniciar la página
            metodosPago.classList.remove('d-none'); // Mostrar métodos de pago
            siguienteBtn.style.display = 'none'; // Ocultar botón de "Siguiente"
            cancelarBtn.style.display = 'none'; // Ocultar botón de "Cancelar"
        });

        cancelarBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar reiniciar la página
            window.location.href = '/'; // Redirigir a la página principal
        });
    }

    // Manejar el envío del formulario de pago (Pago Móvil, Transferencia, Zinli)
    const formulariosPago = document.querySelectorAll('#pagoMovilForm, #transferenciaForm, #zinliForm');

    formulariosPago.forEach(formulario => {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault(); // Evitar que el formulario se envíe automáticamente

            let metodoPago;
            if (formulario.id === 'pagoMovilForm') {
                metodoPago = 'Pago Móvil';
            } else if (formulario.id === 'transferenciaForm') {
                metodoPago = 'Transferencia';
            } else if (formulario.id === 'zinliForm') {
                metodoPago = 'Zinli';
            }

            // Obtener el correo del usuario desde un meta tag o usar un correo por defecto
            const metaUsuarioCorreo = document.querySelector('meta[name="usuario-correo"]');
            const emailUsuario = metaUsuarioCorreo ? metaUsuarioCorreo.getAttribute('content') : 'no-reply@example.com';

            // Obtener los productos desde el formulario
            const productos = JSON.parse(document.querySelector('input[name="productos"]').value);

            // Calcular el monto total
            const totalMonto = productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0).toFixed(2);

            // Confirmar el pago enviando los datos al servidor
            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: emailUsuario,
                    productos: productos,
                    total: totalMonto,
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

    // Función para mostrar notificación
    function mostrarNotificacion(mensaje, tipo) {
        // Aquí puedes agregar código para mostrar una notificación en la interfaz
        alert(mensaje);
    }
});