document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.agregar-carrito');
    buttons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productoId = event.target.dataset.productoId;
            try {
                const response = await fetch('/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productoId }),
                });

                const result = await response.json();
                showNotification(result.message, result.success);
            } catch (error) {
                showNotification('Error al agregar el producto al carrito', false);
            }
        });
    });
});

function showNotification(message, success) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;
    notification.style.backgroundColor = success ? 'green' : 'red';
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}