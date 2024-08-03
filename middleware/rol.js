function authorize(role) {
    return function(req, res, next) {
        if (req.user && req.user.role === role) {
            next(); // Usuario tiene el rol adecuado
        } else {
            res.redirect('/error'); // Redirige a una página de acceso denegado
        }
    };
}

module.exports = authorize;