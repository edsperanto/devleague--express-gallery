const redis = require('redis');
const client = redis.createClient();

module.exports = (req, res, next) => {
	session = 'ses' + req.cookies['connect.sid'].split('.')[0];
	client.get(session, (err, data) => {
		if(data === null) {
			res.locals.loggedin = 'anonymous';
			next();
		} else {
			data = JSON.parse(data);
			if(data.passport) {
				if(data.passport.user) {
					res.locals.loggedin = data.passport.user.username;
				} else {
					res.locals.loggedin = 'anonymous';
				}
			} else {
				res.locals.loggedin = 'anonymous';
			}
			next();
		}
	});
}
