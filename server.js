const express = require('express');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const db = require('./models');
const PORT = process.env.PORT || 3000;
const app = express();

const { Photo } = db;

const hbs = handlebars.create({
	extname: '.hbs',
	defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.static('./public'));

app.get('/', (req, res) => {
	Photo.findAll()
		.then(photos => {
			res.render('index', photos);
		});
});

app.post('/gallery', (req, res) => {
	var {author, link, description} = req.body;
	Photo.create({author, link, description})
		.then(photo => {
			res.json(photo);
		});
});

if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`Server listening on ${PORT}`);
		db.sequelize.sync();
	});
}

module.exports = app;
