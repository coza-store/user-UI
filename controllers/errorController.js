exports.render404Page = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '',
        user: req.session.user,
        isAuthenticated: req.session.isLoggedIn
    })
};