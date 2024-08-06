function mostrarNotificacion(message, type) {
    const notificationElement = document.createElement('div');
    notificationElement.className = `alert alert-${type}`;
    notificationElement.textContent = message;
    document.body.appendChild(notificationElement);
  
    // Opcional: Ocultar la notificación después de un tiempo
    setTimeout(() => {
      document.body.removeChild(notificationElement);
    }, 3000);
  }  