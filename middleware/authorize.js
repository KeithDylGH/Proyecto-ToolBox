module.exports = function authorize(roles = []) {
    // roles puede ser un string (un solo rol) o un array (múltiples roles)
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const user = req.session.user;

        if (!user) {
            // Si el usuario no está autenticado, redirigir a la página de login o página de error
            return res.redirect('/login');
        }

        if (!roles.includes(user.rol)) {
            // Si el rol del usuario no está en la lista de roles permitidos, redirigir a la página de error
            return res.status(403).render('error/index', { message: 'No tienes permiso para acceder a esta página.' });
        }

        // El usuario tiene el rol adecuado, continuar con la siguiente función de middleware
        next();
    };
};
