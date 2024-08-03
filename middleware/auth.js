// authAndRole.js

function authorize(roles) {
    return function(req, res, next) {
        // Asegúrate de que `req.session.user` contenga la información del usuario
        if (req.session.user && roles.includes(req.session.user.role)) {
            next(); // Usuario tiene uno de los roles adecuados
        } else {
            res.redirect('/error'); // Redirige a una página de acceso denegado
        }
    };
}

module.exports = { authorize };
