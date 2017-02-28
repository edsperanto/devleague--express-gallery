const express = require('express');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const gen = require('./helper/gen');
const PORT = process.env.PORT || 3000;
const app = express();
const gallery = require('./routes/gallery');

const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const isAuthenticated = require('./helper/isAuthenticated');
const showLogout = require('./helper/showLogout');
const RedisStore = require('connect-redis')(session);
const CONFIG = require('./config/config.json');

const loadUser = require('./helper/loadUser');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());

app.use(session({
	store: new RedisStore(),
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
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
					if(res) done(null, user);
					else done(null, false, {message: 'bad password'});
				});
			}
		}).catch(err => console.log('error: ', err));
	}
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(({id}, done) => {
	User.findOne({where: {id}})
		.then(user => done(null, user));
});

app.use(loadUser);
app.use(showLogout(app));

app.use(express.static('./public'));

app.get('/', (req, res) => {
	gen.allListing(Photo)
		.then(data => {
			res.render('index', data);
		});
});

app.get('/user/new', (req, res) => {
	res.render('newUser');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', passport.
	authenticate('local', {
		successRedirect: '/success',
		failureRedirect: '/login'
	}));

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect(gen.URI())
});
 
app.get('/success', (req, res) => {
	res.redirect(gen.URI());
});

app.post('/user/new', (req, res) => {
	console.log('gen new');
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

app.use(isAuthenticated);

app.use('/gallery', gallery);

app.use((req, res, next) => {
	res.status(404);
	res.render('404');
});

if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`Server listening on ${PORT}`);
		db.sequelize.sync();
	});
}

module.exports = app;
