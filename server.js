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
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const RedisStore = require('connect-redis')(session);
const CONFIG = require('./config/config.json');

const db = require('./models');
const { Photo, User } = db;

const saltRounds = 10;

const hbs = handlebars.create({
	extname: '.hbs',
	defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({
	store: new RedisStore(),
	secret: 'keyboard cat',
	resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy (
	function(username, password, done) {
		User.findOne({where: {username: username}}).then(user => {
			if(user === null) {
				console.log('user failed');
				done(null, false, {message: 'bad username'});
			}else{
				bcrypt.compare(password, user.password).then(res => {
					if(res) {
						gen.newUser(username);
						done(null, user);
					} else {
						done(null, false, {message: 'bad password'});
					}
				});
			}
		}).catch(err => console.log('error: ', err));
	}
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use((req, res, next) => {
	gen.lastURI(req.path);
	next();
});

app.use(express.static('./public'));
app.use('/gallery', gallery);

app.get('/', (req, res) => {
	gen.allListing(Photo)
		.then(data => {
			data.loggedin = gen.user();
			res.render('index', data);
		});
});

app.get('/user/new', (req, res) => {
	res.render('newUser', {loggedin: gen.user()});
});

app.post('/user/new', (req, res) => {
	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash) {
			console.log('hash: ', hash);
			User.create({
				username: req.body.username,
				password: hash
			}).then(_ => {
				res.redirect('/login');
			});
		});
	});
});

app.get('/login', (req, res) => {
	res.render('login', {loggedin: gen.user()});
});

app.post('/login', passport.
	authenticate('local', {
		successRedirect: '/success',
		failureRedirect: '/login'
	}));

app.get('/success', isAuthenticated, (req, res) => {
	gen.confUser();
	res.redirect(gen.URI());
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
