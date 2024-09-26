// Función para actualizar el estado de "atendido"
async function updateNotificacion(notificacionId) {
    const atendido = document.getElementById(`atendido-${notificacionId}`).checked;

    try {
        const response = await fetch(`/api/notificaciones/actualizar/${notificacionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ atendido })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la notificación.');
        }

        alert('Notificación actualizada correctamente.');
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al actualizar la notificación.');
    }
}

// Función para eliminar una notificación
async function deleteNotificacion(notificacionId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
        try {
            const response = await fetch(`/api/notificaciones/eliminar/${notificacionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la notificación.');
            }

            alert('Notificación eliminada correctamente.');
            window.location.reload();  // Recargar la página para reflejar los cambios
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al eliminar la notificación.');
        }
    }
}