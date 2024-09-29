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

  // Para depuración: verificar los datos que se envían
  console.log('Datos enviados:', Object.fromEntries(formData.entries()));

  fetch('/api/categorias', { // Cambiado a la ruta original
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
          this.reset(); // Reiniciar el formulario
          // Opcional: puedes actualizar la lista de categorías aquí sin necesidad de recargar
          // location.reload(); // Descomentar si deseas recargar la página para mostrar la nueva categoría
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
              return response.json(); // Retorna la respuesta en formato JSON
          } else {
              throw new Error('Error al actualizar categoría'); // Lanzar error en caso de fallo
          }
      })
      .then(data => {
          if (data.success) {
              showNotification('Categoría actualizada con éxito', 'success');
              // Opcional: actualizar la categoría en la lista sin recargar
              // location.reload(); // Descomentar si deseas recargar la página para ver los cambios
          }
      })
      .catch(err => {
          hideLoader();
          console.error('Error:', err); // Imprimir el error en la consola para depuración
          showNotification(err.message, 'error');
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
                  return response.json(); // Retorna la respuesta en formato JSON
              } else {
                  throw new Error('Error al eliminar categoría'); // Lanzar error en caso de fallo
              }
          })
          .then(data => {
              if (data.success) {
                  showNotification('Categoría eliminada con éxito', 'success');
                  // Opcional: eliminar la categoría de la lista sin recargar
                  // location.reload(); // Descomentar si deseas recargar la página
              }
          })
          .catch(err => {
              hideLoader();
              console.error('Error:', err); // Imprimir el error en la consola para depuración
              showNotification(err.message, 'error');
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