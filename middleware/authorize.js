module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            console.log('Sesión no encontrada o usuario no autenticado');
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const user = req.session.user;
        console.log('Usuario autenticado:', user);

        if (!rolesPermitidos.includes(user.rol)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' });
        }

        next();
    };
};