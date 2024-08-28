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

//carrito de compra
$(document).ready(function () {
    // Evento de clic para el botón "Agregar al Carrito"
    $('.btn-agregar-carrito').click(function () {
        var productoId = $(this).data('producto-id');
        $.ajax({
            url: '/api/carrito/add',
            method: 'POST',
            data: { productoId: productoId },
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                console.log('Producto añadido:', response);
                mostrarNotificacion(response.mensaje);
                actualizarCarrito(response.carrito);
            },
            error: function (xhr, status, error) {
                console.log('Error:', error, 'Status:', status, 'Response:', xhr.responseText);
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
                '<div class="d-flex align-items-center mb-2">' +
                '<img src="' + item.imagen + '" alt="' + item.nombre + '" style="width: 50px; height: auto; margin-right: 10px;" />' +
                '<div>' +
                '<h6>' + item.nombre + '</h6>' +
                '<p>Precio: $' + item.precio.toFixed(2) + '</p>' +
                '<p>Cantidad: ' + item.cantidad + '</p>' +
                '</div>' +
                '</div>'
            );
        });

        // Actualizar la cantidad total en el carrito
        var cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        $('#cantidadTotal').text('Cantidad Total: ' + cantidadTotal);
    }

    // Evento para vaciar el carrito
    $('#vaciarCarrito').click(function () {
        $.ajax({
            url: '/api/carrito/vaciar',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                mostrarNotificacion(response.mensaje);
                $('#carritoItems').empty();
                $('#cantidadTotal').text('Cantidad Total: 0');
            },
            error: function (xhr, status, error) {
                console.log('Error:', error, 'Status:', status, 'Response:', xhr.responseText);
                mostrarNotificacion('Error al vaciar el carrito.');
            }
        });
    });
});