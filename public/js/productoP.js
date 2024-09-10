document.addEventListener('DOMContentLoaded', () => {
  const agregarCarritoBtn = document.getElementById('agregarCarritoBtn');

  if (agregarCarritoBtn) {
      agregarCarritoBtn.addEventListener('click', async function() {
          const productoId = '<%= producto._id %>'; // Esta línea se eliminará de aquí
          const cantidad = 1;

          try {
              const response = await fetch('/api/carrito/add', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ productoId, cantidad }),
                  credentials: 'same-origin'
              });

              const result = await response.json();
              if (response.ok) {
                  alert('Producto añadido al carrito');
              } else {
                  alert('Error al añadir el producto al carrito');
              }
          } catch (error) {
              console.error('Error:', error);
              alert('Error al añadir el producto al carrito');
          }
      });
  }
});