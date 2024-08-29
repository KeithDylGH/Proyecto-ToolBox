module.exports = function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        console.log('Session object:', req.session);
        console.log('Session user:', req.session.user);

        const user = req.session.user;

        if (!user) {
            console.log('Usuario no autenticado, enviando 401');
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (roles.length && !roles.includes(user.rol)) {
            console.log('Usuario no autorizado, enviando 403');
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }

        next();
    };
};