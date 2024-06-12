const app = require('./app');

// Definir el puerto desde las variables de entorno o usar 4000 por defecto
const PORT = process.env.PORT || 4000;

// Iniciar el servidor
app.listen(PORT, '44.226.122.3', () => {
    console.log(`Servidor conectado (escuchando) al puerto ${PORT}`);
});
