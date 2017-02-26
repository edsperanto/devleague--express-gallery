const gen = require('./gen');
module.exports = (app) => {
	return (req, res, next) => {
		gen.lastURI(req.path);
		if(req.isAuthenticated()) {
			app.locals.authorized = true;
			next();
		} else {
			app.locals.authorized = false;
			next();
		}
	}
}
