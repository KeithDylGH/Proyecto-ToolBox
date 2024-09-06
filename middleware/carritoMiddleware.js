const Usuario = require('./models/Usuario');

const carritoMiddleware = async (req, res, next) => {
  if (req.session.user && req.session.user._id) {
    try {
      const usuario = await Usuario.findById(req.session.user._id).populate('carrito.producto');
      res.locals.carrito = usuario.carrito || [];
    } catch (err) {
      console.error('Error al obtener el carrito del usuario:', err);
      res.locals.carrito = [];
    }
  } else {
    res.locals.carrito = [];
  }
  next();
};

module.exports = carritoMiddleware;
