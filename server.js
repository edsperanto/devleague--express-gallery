const express = require('express');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const gen = require('./helper/gen');
const initialize = require('./helper/initialize');
const PORT = process.env.PORT || 3000;
const app = express();
const gallery = require('./routes/gallery');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CONFIG = require('./config/config.json');

const db = require('./models');
const { Photo, User } = db;

const hbs = handlebars.create({
	extname: '.hbs',
	defaultLayout: 'app'
});

initialize(Photo);
initialize(User);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({secret: CONFIG.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

const authenticate = (username, password) => 
	User.findOne({where: {username, password}});

passport.use(new LocalStrategy(
  (username, password, done) => 
		authenticate(username, password)
			.then(user => done(null, user || false))
  
));

passport.serializeUser(function(user, done) {
	return done(null, user);
});

passport.deserializeUser(function(user, done) {
	return done(null, user);
});

app.use(express.static('./public'));
app.use('/gallery', gallery);

app.get('/', (req, res) => {
	gen.allListing(Photo)
		.then(data => res.render('index', data));
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', passport.
	authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

app.get('/secret', isAuthenticated, (req, res) => {
	res.send('this is my first secret page');
});

function isAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	}else{
		res.redirect('/login');
	}
}

if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`Server listening on ${PORT}`);
		db.sequelize.sync();
	});
}

module.exports = app;
