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
            url: '/api/carrito/add',
            method: 'POST',
            data: { productoId: productoId },
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                mostrarNotificacion(response.mensaje);
                actualizarCarrito(response.carrito);
            },
            error: function (xhr, status, error) {
                if (xhr.status === 401) {
                    mostrarNotificacion('Debes iniciar sesión para agregar productos al carrito.');
                } else if (xhr.status === 403) {
                    mostrarNotificacion('No tienes permiso para agregar productos al carrito.');
                } else if (xhr.status === 404) {
                    mostrarNotificacion('Ruta no encontrada. Verifica la configuración del servidor.');
                } else if (xhr.status === 500) {
                    mostrarNotificacion('Error en el servidor. Por favor intenta más tarde.');
                } else {
                    mostrarNotificacion('Error desconocido al agregar el producto al carrito');
                }
                console.error('Error en la solicitud AJAX:', status, error);
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
                '<div>' +
                '<img src="' + item.imagen + '" alt="' + item.nombre + '" style="width: 50px; height: auto; margin-right: 10px;" />' +
                item.nombre + ' - Cantidad: ' + item.cantidad +
                '</div>'
            );
        });
    }
});