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