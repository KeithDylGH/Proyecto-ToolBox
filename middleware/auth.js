function isAdminOrBoss(req, res, next) {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'boss')) {
        next();
    } else {
        res.status(403).render('error', { message: 'No tienes permiso para acceder a esta página.' });
    }
}

module.exports = isAdminOrBoss;
