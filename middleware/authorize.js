module.exports = function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        console.log('Session user:', req.session.user);  // Agregado para depuración

        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!roles.includes(user.rol)) {
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }

        next();
    };
};