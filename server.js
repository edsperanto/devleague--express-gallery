const express = require('express');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const db = require('./models');
const gen = require('./helper/gen');
const initialize = require('./helper/initialize');
const PORT = process.env.PORT || 3000;
const app = express();

const { Photo } = db;

const hbs = handlebars.create({
	extname: '.hbs',
	defaultLayout: 'app'
});

initialize(Photo);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.static('./public'));

app.get('/', (req, res) => {
	gen.allListing(Photo)
		.then(data => res.render('index', data));
});

app.get('/:dir/css/app.css', (req, res) => {
	res.redirect('/css/app.css');
});

app.get('/:dir/js/app.js', (req, res) => {
	res.redirect('/js/app.js');
});

app.get('/gallery/new', (req, res) => {

});

app.get('/gallery/:id', (req, res) => {
	Photo.findOne({where:{id:req.params.id}})
		.then(photo => gen.details(photo, Photo))
		.then(details => res.render('detail', details));
});

app.get('/gallery/:id/edit', (req, res) => {

});

app.post('/gallery', (req, res) => {
	var {author, link, description} = req.body;
	Photo.create({author, link, description})
		.then(photo => {
			res.json(photo);
		})
		.catch(err => {
			let errMsg = {};
			err.errors.forEach(({message, path}) => {
				errMsg[path] = message;
			});
			res.json(errMsg);
		});
});

app.put('/gallery/:id', (req, res) => {
	var {author, link, description} = req.body;
	Photo.update(
		{author, link, description},
		{where: {id: req.params.id}}
	);
});

app.delete('/gallery/:id', (req, res) => {
	Photo.destroy({where: {id: req.params.id}})
		.then(id => {
			res.json({success: true});
		});
})

if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`Server listening on ${PORT}`);
		db.sequelize.sync();
	});
}

module.exports = app;
