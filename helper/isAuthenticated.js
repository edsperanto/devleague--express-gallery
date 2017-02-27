module.exports = (req, res, next) => {
	const priv = [
		/^\/gallery\/new$/g,
		/^\/gallery\/[0-9]+\/edit$/g
	];
	const privAcc = priv.some(url => url.test(req.originalUrl));
	if(req.method !== 'GET' || privAcc) {
		if(req.isAuthenticated()) next();
		else res.redirect('/login');
	} else {
		next();
	}
}
