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

app.use(session({secret: CONFIG.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

const authenticate = (username, password) => {
  // get user data from the DB
  const { USER, PASSWORD } = CONFIG;

  // check if the user is authenticated or not
  return ( username === USER && password === PASSWORD );
};

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('username, password: ', username, password);
    // check if the user is authenticated or not
    if( authenticate(username, password) ) {

      // User data from the DB
      const user = {
        name: 'Joe',
        role: 'admin',
        favColor: 'green',
        isAdmin: true,
      };

      return done(null, user); // no error, and data = user
    }
    return done(null, false); // error and authenticted = false
  }
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
