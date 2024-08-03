function isAdminOrBoss(req, res, next) {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'boss')) {
        next();
    } else {
        res.status(403).render('error/index', { message: 'ERROR al entrar a la pagina.' });
    }
}

module.exports = isAdminOrBoss;
