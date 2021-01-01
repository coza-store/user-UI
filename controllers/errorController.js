exports.render404Page = async(req, res, next) => {
    return res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '',
        user: req.user,
        isAuthenticated: req.isAuthenticated()
    })
};