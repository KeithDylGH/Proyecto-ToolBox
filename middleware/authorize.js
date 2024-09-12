module.exports = (rolesPermitidos, rutasPublicas) => {
    return (req, res, next) => {
        // Verificar si la ruta actual está en la lista de rutas públicas
        if (rutasPublicas.includes(req.path)) {
            return next();
        }

        // Verificar la autenticación de la sesión
        if (!req.session || !req.session.user) {
            // Acceso denegado para rutas protegidas
            console.log('Sesión no encontrada o usuario no autenticado para la ruta', req.path);
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const user = req.session.user;
        console.log('Usuario autenticado:', user);

        // Verificar permisos
        if (!rolesPermitidos.includes(user.rol)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' });
        }

        // Permitir acceso si la autenticación y permisos son correctos
        next();
    };
};