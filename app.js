const bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer'),
  createError = require('http-errors');

const indexRoute = require('./routes/index'),
  blogsRoute = require('./routes/blogs/blogs'),
  authRoute = require('./routes/admin/auth'),
  adminRoute = require('./routes/admin/admin');

const creds = require('./config/keys'),
  passport = require('./services/passport');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(expressSanitizer());
app.use(methodOverride('_method'));

app.use(
  require('express-session')({
    secret: creds.session_secret,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoute);
app.use(blogsRoute);
app.use(authRoute);
app.use(adminRoute);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;