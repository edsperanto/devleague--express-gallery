const redis = require('redis');
const client = redis.createClient();

module.exports = (req, res, next) => {
	session = 'ses' + req.cookies['connect.sid'].split('.')[0];
	client.get(session, (err, data) => {
		data = JSON.parse(data);
		if(data.passport.user) {
			res.locals.loggedin = data.passport.user.username;
		} else {
			res.locals.loggedin = 'anonymous';
		}
		next();
	});
}
