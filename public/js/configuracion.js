// Datos del usuario
const form = document.querySelector('form');
const eliminarBtn = document.querySelector('.btn-danger');

// Manejar el envío del formulario para actualizar los datos del usuario
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const usuario = document.getElementById('usuario').value;
    const telefono = document.getElementById('telefono').value;
    const cedula = document.getElementById('cedula').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        const response = await fetch('/api/usuario/actualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                apellido,
                correo,
                usuario,
                telefono,
                cedula,
                contrasena,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos');
        }

        alert('Datos actualizados correctamente');
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al actualizar los datos');
    }
});

// Manejar la eliminación de la cuenta
eliminarBtn.addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
        try {
            const response = await fetch('/api/usuario/eliminar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la cuenta');
            }

            alert('Cuenta eliminada correctamente');
            window.location.href = '/'; // Redirigir al usuario a la página de inicio o login
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al eliminar la cuenta');
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const saveChangesButton = document.getElementById('saveChanges');
    const deleteAccountButton = document.getElementById('deleteAccount');

    // Función para guardar los cambios en los datos del usuario
    saveChangesButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const idnumber = document.getElementById('idnumber').value;

        // Validación básica de los campos
        if (!name || !lastname || !email || !username || !password || !phone || !idnumber) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Enviar datos al servidor para actualizar el perfil
        fetch('/api/actualizar-perfil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                lastname: lastname,
                email: email,
                username: username,
                password: password,
                phone: phone,
                idnumber: idnumber
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Datos actualizados correctamente.');
            } else {
                alert('Error al actualizar los datos.');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Función para eliminar la cuenta del usuario
    deleteAccountButton.addEventListener('click', function () {
        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            fetch('/api/eliminar-cuenta', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cuenta eliminada correctamente.');
                    window.location.href = '/'; // Redirige al inicio o a otra página
                } else {
                    alert('Error al eliminar la cuenta.');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
});
