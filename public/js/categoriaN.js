// Mostrar loader
function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

// Ocultar loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Manejar envío del formulario para agregar categoría
document.getElementById('formularioCategoria').addEventListener('submit', function (e) {
  e.preventDefault();
  showLoader();

  const formData = new FormData(this);

  fetch('/api/categorias', {
      method: 'POST',
      body: formData,
  })
  .then(response => {
      hideLoader();
      if (response.redirected) {
          window.location.href = response.url;
      } else {
          showNotification('Error al agregar categoría', 'error');
      }
  })
  .catch(err => {
      hideLoader();
      showNotification('Ocurrió un error', 'error');
  });
});

// Manejar actualización de categorías
const formActualizar = document.querySelectorAll('.formActualizar');
formActualizar.forEach(form => {
  form.addEventListener('submit', function (e) {
      e.preventDefault();
      showLoader(); // Mostrar loader
      const formData = new FormData(this);

      fetch(this.action, {
          method: 'POST',
          body: formData,
      })
      .then(response => {
          hideLoader();
          if (response.redirected) {
              window.location.href = response.url;
          } else {
              showNotification('Error al actualizar categoría', 'error');
          }
      })
      .catch(err => {
          hideLoader();
          showNotification('Ocurrió un error', 'error');
      });
  });
});

// Manejar eliminación de categorías
const formEliminar = document.querySelectorAll('.formEliminar');
formEliminar.forEach(form => {
  form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
          showLoader(); // Mostrar loader normal
          const formData = new FormData(this);

          fetch(this.action, {
              method: 'POST',
              body: formData,
          })
          .then(response => {
              hideLoader();
              if (response.redirected) {
                  window.location.href = response.url;
              } else {
                  showNotification('Error al eliminar categoría', 'error');
              }
          })
          .catch(err => {
              hideLoader();
              showNotification('Ocurrió un error', 'error');
          });
      }
  });
});

// Mostrar notificación
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
      notification.style.display = 'none';
  }, 3000);
}