function isAdminOrBoss(req, res, next) {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'boss')) {
        next();
    } else {
        res.status(403).render('error', { message: 'No tienes permiso para acceder a esta página.' });
    }
}

function authorize(role) {
    return function(req, res, next) {
        if (req.user && req.user.role === role) {
            next(); // Usuario tiene el rol adecuado
        } else {
            res.redirect('/unauthorized'); // Redirige a una página de acceso denegado
        }
    };
}

module.exports = isAdminOrBoss;
