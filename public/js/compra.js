document.addEventListener('DOMContentLoaded', function () {
    // Obtén los elementos de la página
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');

    // Verifica si los elementos existen antes de agregar los eventos
    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            // Muestra los métodos de pago y oculta los botones
            metodosPago.classList.remove('d-none');
            siguienteBtn.style.display = 'none';
            cancelarBtn.style.display = 'none';
        });
    }

    // Botones de métodos de pago
    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    // Verifica si los botones de métodos de pago existen antes de agregar los eventos
    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            // Muestra las instrucciones para Pago Móvil
            mostrarInstruccionesPago('pagoMovilModal');
        });

        transferenciaBtn.addEventListener('click', function () {
            // Muestra las instrucciones para Transferencia
            mostrarInstruccionesPago('transferenciaModal');
        });

        zinliBtn.addEventListener('click', function () {
            // Muestra las instrucciones para Zinli
            mostrarInstruccionesPago('zinliModal');
        });

        cancelarPagoBtn.addEventListener('click', function () {
            // Redirige al usuario a la página principal o una página de cancelación
            window.location.href = '/';
        });
    }

    // Función para mostrar las instrucciones de pago y ocultar las demás
    function mostrarInstruccionesPago(instruccionId) {
        // Oculta todas las instrucciones de pago
        const modals = document.querySelectorAll('.modal');
        modals.forEach(function (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });

        // Muestra el modal del método seleccionado
        const modal = document.getElementById(instruccionId);
        if (modal) {
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        }
    }
});