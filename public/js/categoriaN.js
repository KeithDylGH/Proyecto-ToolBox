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
  document.getElementById('miniLoader').style.display = 'flex'; // Cambiar 'miniLoader' según el ID que uses
}

// Ocultar mini loader
function hideMiniLoader() {
  document.getElementById('miniLoader').style.display = 'none'; // Cambiar 'miniLoader' según el ID que uses
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
      .then(response => response.json())
      .then(data => {
          hideLoader();
          if (data.success) {
              showNotification('Categoría agregada con éxito', 'success');
              document.getElementById('formularioCategoria').reset();
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
      showMiniLoader(); // Mostrar mini loader
      const formData = new FormData(this);

      fetch(this.action, {
          method: 'POST',
          body: formData,
      })
          .then(response => response.json())
          .then(data => {
              hideMiniLoader();
              if (data.success) {
                  showNotification('Categoría actualizada con éxito', 'success');
              } else {
                  showNotification('Error al actualizar categoría', 'error');
              }
          })
          .catch(err => {
              hideMiniLoader();
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
              .then(response => response.json())
              .then(data => {
                  hideLoader();
                  if (data.success) {
                      showNotification('Categoría eliminada con éxito', 'success');
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
  const notification = document.querySelector('.notification');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
      notification.style.display = 'none';
  }, 3000);
}