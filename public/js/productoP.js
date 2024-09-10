document.addEventListener('DOMContentLoaded', function() {
  const botonesAgregarCarrito = document.querySelectorAll('.btn-agregar-carrito');

  botonesAgregarCarrito.forEach(boton => {
      boton.addEventListener('click', function() {
          const productoId = this.getAttribute('data-producto-id');
          
          fetch(`/api/carrito/add`, { // Ajustar ruta aquí
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ productoId: productoId })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  mostrarNotificacion('Producto agregado al carrito', 'success');
              } else {
                  mostrarNotificacion('Error al agregar producto al carrito', 'error');
              }
          })
          .catch(error => {
              mostrarNotificacion('Error de red', 'error');
          });
      });
  });
});