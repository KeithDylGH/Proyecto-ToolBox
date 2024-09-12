document.addEventListener('DOMContentLoaded', function () {
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

    const pagoMovilBtn = document.getElementById('pagoMovilBtn');
    const transferenciaBtn = document.getElementById('transferenciaBtn');
    const zinliBtn = document.getElementById('zinliBtn');
    const cancelarPagoBtn = document.getElementById('cancelarPagoBtn');

    if (pagoMovilBtn && transferenciaBtn && zinliBtn && cancelarPagoBtn) {
        pagoMovilBtn.addEventListener('click', function () {
            // Mostrar instrucciones para Pago Móvil
        });

        transferenciaBtn.addEventListener('click', function () {
            // Mostrar instrucciones para Transferencia
        });

        zinliBtn.addEventListener('click', function () {
            // Mostrar instrucciones para Zinli
        });

        cancelarPagoBtn.addEventListener('click', function () {
            // Cancelar el pago
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