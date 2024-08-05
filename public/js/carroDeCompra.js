document.addEventListener('DOMContentLoaded', function() {
  const carroProductos = document.getElementById('carro-productos');
  const vaciarCarritoButton = document.getElementById('vaciar-carrito');

  // Función para actualizar el carrito
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

  // Vaciar carrito
  vaciarCarritoButton.addEventListener('click', function() {
      fetch('/carrito/vaciar', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
              actualizarCarrito();
          })
          .catch(error => console.error('Error al vaciar el carrito:', error));
  });

  // Agregar al carrito
  document.querySelectorAll('.agregar-carrito').forEach(button => {
      button.addEventListener('click', function() {
          const productoId = this.getAttribute('data-producto-id');
          fetch('/carrito/agregar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productoId, cantidad: 1 })
          })
          .then(response => response.json())
          .then(data => {
              actualizarCarrito();
          })
          .catch(error => console.error('Error al agregar al carrito:', error));
      });
  });
});