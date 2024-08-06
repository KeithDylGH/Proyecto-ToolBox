document.addEventListener('DOMContentLoaded', function() {
    const notification = document.querySelector('.notification');
  
    // Función para mostrar notificación
    function mostrarNotificacion(mensaje, tipo = 'success') {
      notification.textContent = mensaje;
      notification.classList.add('alert', `alert-${tipo}`);
      notification.style.display = 'block'; // Asegurarse de que la notificación esté visible
  
      setTimeout(() => {
        notification.textContent = '';
        notification.classList.remove('alert', `alert-${tipo}`);
        notification.style.display = 'none'; // Ocultar la notificación después de un tiempo
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
            mostrarNotificacion(data.message, 'success');
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
  });  