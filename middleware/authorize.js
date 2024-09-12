module.exports = (rolesPermitidos = [], rutasPublicas = []) => {
    return (req, res, next) => {
        // Verificar si la ruta actual está en la lista de rutas públicas
        if (rutasPublicas.some(ruta => {
            // Usamos `new RegExp` para manejar rutas con parámetros dinámicos como `/tienda/:categoriaId?`
            const regex = new RegExp(ruta.replace(/:[^\s/]+/g, '[^/]+') + '$');
            return regex.test(req.path);
        })) {
            console.log('Ruta pública, permitiendo acceso:', req.path);
            return next(); // Si es una ruta pública, permite el acceso
        }

        // Verificar la autenticación de la sesión
        if (!req.session || !req.session.user) {
            console.log('Sesión no encontrada o usuario no autenticado para la ruta', req.path);
            return res.status(401).json({ success: false, message: 'No estás autenticado' }); // Acceso denegado
        }

        const user = req.session.user;
        console.log('Usuario autenticado:', user);

        // Verificar permisos
        if (!rolesPermitidos.includes(user.rol)) {
            console.log('Permiso denegado para la ruta', req.path);
            return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción' }); // Permiso denegado
        }

        // Permitir acceso si la autenticación y permisos son correctos
        next();
    };
};