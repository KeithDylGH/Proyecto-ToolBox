// Mostrar loader
function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

// Ocultar loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Manejar envío del formulario para agregar categoría
document.getElementById('formularioCategoria').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevenir el envío normal del formulario
  showLoader(); // Mostrar loader mientras se envía el formulario

  const formData = new FormData(this); // Obtener los datos del formulario

  fetch('/api/categorias/agregar', {
      method: 'POST',
      body: formData,
  })
  .then(response => {
      hideLoader(); // Ocultar loader después de la respuesta
      if (response.ok) {
          return response.json(); // Retornar JSON si la respuesta es exitosa
      } else {
          return response.json().then(data => {
              throw new Error(data.error || 'Error desconocido'); // Lanzar error con el mensaje del servidor
          });
      }
  })
  .then(data => {
      if (data.success) {
          showNotification('Categoría agregada con éxito', 'success'); // Notificación de éxito
          this.reset(); // Opcional: Reiniciar el formulario
      }
  })
  .catch(err => {
      console.error('Error:', err); // Imprimir el error en la consola
      showNotification(err.message, 'error'); // Notificación de error
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
          if (response.ok) {
              showNotification('Categoría actualizada con éxito', 'success');
              return response.json(); // Retorna la respuesta en formato JSON
          } else {
              showNotification('Error al actualizar categoría', 'error');
              return response.json(); // Para manejar el error y mostrarlo si es necesario
          }
      })
      .then(data => {
          if (data && data.error) {
              showNotification(data.error, 'error'); // Mostrar mensaje de error específico si existe
          }
      })
      .catch(err => {
          hideLoader();
          console.error('Error:', err); // Imprimir el error en la consola para depuración
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
          showLoader(); // Mostrar loader
          const formData = new FormData(this);

          fetch(this.action, {
              method: 'POST',
              body: formData,
          })
          .then(response => {
              hideLoader();
              if (response.ok) {
                  showNotification('Categoría eliminada con éxito', 'success');
                  return response.json(); // Retorna la respuesta en formato JSON
              } else {
                  showNotification('Error al eliminar categoría', 'error');
                  return response.json(); // Para manejar el error y mostrarlo si es necesario
              }
          })
          .then(data => {
              if (data && data.error) {
                  showNotification(data.error, 'error'); // Mostrar mensaje de error específico si existe
              }
          })
          .catch(err => {
              hideLoader();
              console.error('Error:', err); // Imprimir el error en la consola para depuración
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