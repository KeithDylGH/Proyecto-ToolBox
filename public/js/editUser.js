document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('formActualizar');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita el envío por defecto

            const formData = new FormData(form);
            const userData = {};

            // Convertir FormData a objeto
            formData.forEach((value, key) => {
                userData[key] = value;
            });

            try {
                const response = await fetch('/api/usuario/actualizar', { // Cambiado a /actualizar
                    method: 'PUT', // Cambiado a PUT
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (!response.ok) {
                    throw new Error('Error en la actualización del usuario');
                }

                const data = await response.json();

                // Manejar la respuesta
                if (data.success) {
                    alert('Usuario actualizado con éxito');
                    // Redirigir o realizar otras acciones
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrió un error al actualizar el usuario.');
            }
        });
    }
});