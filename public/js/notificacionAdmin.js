async function updateNotificacion(id) {
    const checkbox = document.getElementById(`atendido-${id}`);
    const response = await fetch(`/admin/notificacion/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ atendido: checkbox.checked }),
    });

    if (!response.ok) {
      alert('Error al actualizar la notificación.');
    }
  }

  async function deleteNotificacion(id) {
    const response = await fetch(`/admin/notificacion/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      location.reload(); // Recargar la página para actualizar las notificaciones
    } else {
      alert('Error al eliminar la notificación.');
    }
  }