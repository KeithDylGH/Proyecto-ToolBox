//Entrar a la pagina Log-in
document.addEventListener('DOMContentLoaded', function() {

    const botonIniciarSesion = document.getElementById('login');

    botonIniciarSesion.addEventListener('click', function() {
        window.location.href = '/login/';
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const tienda = document.getElementById('categoria1');

    tienda.addEventListener('click', function() {
        window.location.href = '/tienda/';
    });
});

//CARRITO DE COMPRAS
$(document).ready(function () {
    // Evento de clic para el botón "Agregar al Carrito"
    $('.btn-agregar-carrito').click(function () {
        var productoId = $(this).data('producto-id');
        $.ajax({
            url: '/agregar-al-carrito',
            method: 'POST',
            data: { productoId: productoId },
            success: function (response) {
                mostrarNotificacion(response.mensaje);
                actualizarCarrito(response.carrito);
            },
            error: function () {
                mostrarNotificacion('Error al agregar el producto al carrito');
            }
        });
    });

    // Función para mostrar notificación
    function mostrarNotificacion(mensaje) {
        var notificacion = $('.notification');
        notificacion.text(mensaje);
        notificacion.fadeIn().delay(3000).fadeOut();
    }

    // Función para actualizar el contenido del carrito
    function actualizarCarrito(carrito) {
        var carritoItems = $('#carritoItems');
        carritoItems.empty();
        carrito.forEach(function (item) {
            carritoItems.append(
                '<div>' + item.nombre + ' - Cantidad: ' + item.cantidad + '</div>'
            );
        });
    }
});