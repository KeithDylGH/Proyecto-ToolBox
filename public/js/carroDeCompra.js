document.addEventListener('DOMContentLoaded', function() {
    const vaciarCarritoButton = document.getElementById('vaciar-carrito');
    const notification = document.querySelector('.notification');
  
    // Función para mostrar notificación
    function mostrarNotificacion(mensaje, tipo = 'success') {
      notification.textContent = mensaje;
      notification.classList.add('alert', `alert-${tipo}`);
  
      setTimeout(() => {
        notification.textContent = '';
        notification.classList.remove('alert', `alert-${tipo}`);
      }, 3000);
    }
  
    // Agregar al carrito
    document.querySelectorAll('.agregar-carrito').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const productoId = this.getAttribute('data-producto-id');
  
        fetch('/carrito/agregar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productoId, cantidad: 1 })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            mostrarNotificacion(data.message);
          } else {
            mostrarNotificacion(data.error, 'danger');
          }
        })
        .catch(error => {
          console.error('Error al agregar al carrito:', error);
          mostrarNotificacion('Error de conexión', 'danger');
        });
      });
    });
  
    // Vaciar carrito
    vaciarCarritoButton.addEventListener('click', function() {
      fetch('/carrito/vaciar', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          actualizarCarrito();
        })
        .catch(error => console.error('Error al vaciar el carrito:', error));
    });
  
    // Actualizar carrito
    function actualizarCarrito() {
      fetch('/carrito/datos')
        .then(response => response.json())
        .then(data => {
          carroProductos.innerHTML = '';
          if (data.productos.length === 0) {
            carroProductos.innerHTML = '<p>El carrito está vacío.</p>';
          } else {
            data.productos.forEach(producto => {
              const item = document.createElement('p');
              item.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad}`;
              carroProductos.appendChild(item);
            });
          }
        })
        .catch(error => console.error('Error al actualizar el carrito:', error));
    }
  
    // Llamar a la función para actualizar el carrito al cargar la página
    actualizarCarrito();
  });  