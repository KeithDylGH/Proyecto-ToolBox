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
            mostrarModal('pagoMovilModal');
        });

        transferenciaBtn.addEventListener('click', function () {
            mostrarModal('transferenciaModal');
        });

        zinliBtn.addEventListener('click', function () {
            mostrarModal('zinliModal');
        });

        cancelarPagoBtn.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    function mostrarModal(modalId) {
        const modals = ['pagoMovilModal', 'transferenciaModal', 'zinliModal'];
        modals.forEach(function (modal) {
            const modalElement = document.getElementById(modal);
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    
        const selectedModal = document.getElementById(modalId);
        if (selectedModal) {
            let modalInstance = bootstrap.Modal.getInstance(selectedModal);
            if (!modalInstance) {
                modalInstance = new bootstrap.Modal(selectedModal);
            }
            modalInstance.show();
        }
    }    
});