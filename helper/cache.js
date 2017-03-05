const redis = require('redis');
const client = redis.createClient();

module.exports = (() => {

	function init() {
		return (req, res, next) => {
			client.get(req.originalUrl, (err, reply) => {
				if(reply !== null) {
					res.send(reply);
				}else{

					// res.render
					let _render = res.render;
					res.render = function(view, locals) {
						_render.call(this, view, locals, (err, html) => {
							let url = 'express_gallery' + req.originalUrl;
							client.setex(url, 60, html);
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
