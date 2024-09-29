// Mostrar loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
  }

  // Ocultar loader
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }

  // Mostrar mini loader
  function showMiniLoader() {
    document.getElementById('mini-loader').style.display = 'block';
  }

  // Ocultar mini loader
  function hideMiniLoader() {
    document.getElementById('mini-loader').style.display = 'none';
  }

  // Manejar envío del formulario para agregar categoría
  document.getElementById('formularioCategoria').addEventListener('submit', function(e) {
    e.preventDefault();
    showLoader();
    
    const formData = new FormData(this);
    
    fetch('/api/categorias', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      hideLoader();
      if (data.success) {
        showNotification('Categoría agregada con éxito', 'success');
      } else {
        showNotification('Error al agregar categoría', 'error');
      }
      // Aquí puedes actualizar la lista de categorías
    })
    .catch(err => {
      hideLoader();
      showNotification('Ocurrió un error', 'error');
    });
  });

  // Mostrar notificación
  function showNotification(message, type = 'success') {
    const notification = document.querySelector('.notification');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }