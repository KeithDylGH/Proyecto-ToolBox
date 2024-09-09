document.addEventListener('DOMContentLoaded', () => {
    const agregarCarritoBtn = document.getElementById('agregarCarritoBtn');
  
    if (agregarCarritoBtn) {
      agregarCarritoBtn.addEventListener('click', async function() {
        const productoId = agregarCarritoBtn.getAttribute('data-producto-id'); // Obtener productoId del atributo data-producto-id
        const cantidad = 1; // Puedes ajustar la cantidad si es necesario
  
        try {
          const response = await fetch('/carrito/agregar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productoId, cantidad })
          });
  
          const result = await response.json();
          if (response.ok) {
            alert('Producto añadido al carrito');
          } else {
            alert('Error al añadir el producto al carrito: ' + result.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error al añadir el producto al carrito');
        }
      });
    }
  });  