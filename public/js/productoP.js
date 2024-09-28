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
                    showNotification('Producto añadido al carrito', 'success'); // Mostrar notificación
                } else {
                    showNotification('Error al añadir el producto al carrito', 'error'); // Notificación de error
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al añadir el producto al carrito', 'error'); // Notificación de error
            }
        });
    });

    // Manejar la acción de compra (este botón sí redirige)
    const comprarBtn = document.getElementById("comprarBtn");
    if (comprarBtn) {
        comprarBtn.addEventListener("click", async function(event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

            const productoId = this.getAttribute("data-producto-id");
            const cantidad = 1; // Cantidad que deseas añadir

            // Intentar añadir el producto al carrito y luego redirigir
            try {
                const response = await fetch("/api/carrito/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productoId, cantidad }),
                });

                if (response.ok) {
                    showNotification('Producto añadido al carrito', 'success'); // Mostrar notificación
                    setTimeout(() => {
                        window.location.href = "/cuenta/carrito";
                    }, 2000);
                } else {
                    showNotification("Error al añadir el producto al carrito.", "error"); // Notificación de error
                }
            } catch (error) {
                console.error("Error:", error);
                showNotification("Ocurrió un error al añadir el producto al carrito.", "error"); // Notificación de error
            }
        });
    }
});