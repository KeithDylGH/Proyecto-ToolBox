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
            body: JSON.stringify({ productoId, cantidad })
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

  document.addEventListener("DOMContentLoaded", function() {
    const comprarBtn = document.getElementById("comprarBtn");

    if (comprarBtn) {
        comprarBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

            const productoId = this.getAttribute("data-producto-id");

            // Aquí puedes hacer una petición POST a tu servidor para agregar el producto al carrito
            fetch("/api/agregar-al-carrito", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productoId: productoId }),
            })
            .then(response => {
                if (response.ok) {
                    // Redirigir a la página del carrito si el producto se agrega correctamente
                    window.location.href = "/cuenta/carrito";
                } else {
                    // Manejar error al agregar el producto
                    alert("Error al agregar el producto al carrito.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Ocurrió un error al agregar el producto al carrito.");
            });
        });
    }
});