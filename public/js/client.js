document.addEventListener('DOMContentLoaded', function() {
    const paginaCliente = document.getElementById('carritoBtn');

    paginaCliente.addEventListener('click', function() {
        window.location.href = '/cuenta/carrito';
    });
});