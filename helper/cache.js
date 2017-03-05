const redis = require('redis');
const client = redis.createClient();

module.exports = (() => {

	function init() {
		return (req, res, next) => {
			client.get(req.originalUrl, (err, reply) => {
				if(reply !== null) {
					res.send(reply);
				}else{
					let _render = res.render;
					res.render = function(view, locals) {
						_render.call(this, view, locals, (err, html) => {
							client.setex(req.originalUrl, 60, html);
							res.send(html);
						});
					}
					next();
				}
			});
		}
	}

	return { init };

})();
