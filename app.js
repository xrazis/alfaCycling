const bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer');

const indexRoute = require('./routes/index'),
  blogsRoute = require('./routes/blogs/blogs'),
  authRoute = require('./routes/admin/auth'),
  adminRoute = require('./routes/admin/admin');

const creds = require('./config/creds'),
  passport = require('./routes/admin/passport');

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

app.use((req, res, next) => {
  res.status(404).render('error.ejs');
})

//  live - plesk
// const http = require('http');
// http.createServer(app).listen(process.env.PORT);

//  local
app.listen(3000, '127.0.0.1');
console.log('Server is up and running!');