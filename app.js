var bodyParser = require("body-parser"),
  express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  passport = require("passport"),
  flash = require("connect-flash");

var blogsRoute = require("./routes/blogs"),
  indexRoute = require("./routes/index");

const creds = require("./config/creds");
require("./middleware/passport")(passport);

//  APP/CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//  PASSPORT
app.use(
  require("express-session")({
    secret: creds.session_secret,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//  RESTFUL ROUTES
app.use("/", indexRoute);
app.use("/blogs", blogsRoute);

//  live - plesk
// const http = require("http");
// http.createServer(app).listen(process.env.PORT);

//  local
app.listen(3000, "127.0.0.1");
console.log("Server is up and running!");