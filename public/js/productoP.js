document.addEventListener('DOMContentLoaded', () => {
    // Manejar la acción de agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
        button.addEventListener('click', async function() {
            const productoId = this.getAttribute('data-producto-id');
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
    });
  
    // Manejar la acción de compra
    const comprarBtn = document.getElementById("comprarBtn");
    if (comprarBtn) {
        comprarBtn.addEventListener("click", async function(event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
  
            const productoId = this.getAttribute("data-producto-id");
            const cantidad = 1; // Cantidad que deseas añadir
  
            // Intentar añadir el producto al carrito
            try {
                const response = await fetch("/api/carrito/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productoId, cantidad }),
                });
  
                if (response.ok) {
                    // Redirigir a la página del carrito si el producto se agrega correctamente
                    window.location.href = "/cuenta/carrito";
                } else {
                    // Manejar error al agregar el producto
                    alert("Error al añadir el producto al carrito.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error al añadir el producto al carrito.");
            }
        });
    }
  });  