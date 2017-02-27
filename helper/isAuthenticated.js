module.exports = (req, res, next) => {
	if(req.method === 'GET') {
		next();
	} else {
		if(req.isAuthenticated()) next();
		else res.redirect('/login');
	}
}
