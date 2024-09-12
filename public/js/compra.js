document.addEventListener('DOMContentLoaded', function () {
    // Botones y elementos comunes
    const siguienteBtn = document.getElementById('siguienteBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const metodosPago = document.getElementById('metodosPago');

    if (siguienteBtn && cancelarBtn && metodosPago) {
        siguienteBtn.addEventListener('click', function () {
            // Muestra los métodos de pago y oculta los botones
            metodosPago.classList.remove('d-none');
            siguienteBtn.style.display = 'none';
            cancelarBtn.style.display = 'none';
        });
    }

    // Métodos de pago
    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            // Muestra el modal para Pago Móvil
            const pagoMovilModal = new bootstrap.Modal(document.getElementById('pagoMovilModal'));
            pagoMovilModal.show();
        });

        transferenciaBtn.addEventListener('click', function () {
            // Muestra el modal para Transferencia
            const transferenciaModal = new bootstrap.Modal(document.getElementById('transferenciaModal'));
            transferenciaModal.show();
        });

        zinliBtn.addEventListener('click', function () {
            // Muestra el modal para Zinli
            const zinliModal = new bootstrap.Modal(document.getElementById('zinliModal'));
            zinliModal.show();
        });

        cancelarPagoBtn.addEventListener('click', function () {
            // Redirige al usuario a la página principal
            window.location.href = '/';
        });
    }

    const confirmarPagoBtn = document.querySelectorAll('#confirmarPagoBtn');

    confirmarPagoBtn.forEach(button => {
        button.addEventListener('click', function () {
            // Envía una solicitud al servidor para confirmar el pago
            fetch('/confirmar-pago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // Incluye los datos necesarios, como el id del producto, cantidad, etc.
                })
            }).then(response => response.json())
              .then(data => {
                  if (data.success) {
                      alert('Pago confirmado. Se te enviará un correo con el comprobante.');
                  } else {
                      alert('Hubo un problema al confirmar el pago.');
                  }
              })
              .catch(error => console.error('Error:', error));
        });
    });
});