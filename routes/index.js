var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  nodemailer = require("nodemailer"),
  multer = require('multer'),
  middleware = require("../middleware/user"),
  db = require("../config/db_conn");

const creds = require("../config/creds");

//  NODEMAILER CONFIG
var transport = {
  host: "linux85.papaki.gr",
  auth: {
    user: creds.email_user,
    pass: creds.email_password
  }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Nodemailer is running...");
  }
});

//  MULTER CONFIG
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

var upload = multer({
  storage: storage
})

//  ROOT ROUTE
router.get("/", (req, res) => {
  res.redirect("/index");
});

//  INDEX ROUTE
router.get("/index", (req, res) => {
  var sql = "SELECT * FROM blogs ORDER BY id DESC LIMIT 3;";
  db.query(sql, (error, blogs) => {
    if (error) {
      res.render("error");
    } else {
      res.render("index", {
        blogs: blogs
      });
    }
  });
});

//  ABOUT ROUTE
router.get("/about", (req, res) => {
  res.render("about", {
    currentUser: req.user
  });
});

//  CONTACT ROUTE
router.post("/contact", (req, res) => {
  var email = req.body.email;
  var name = req.body.name;
  var message = req.body.message;

  var mail = {
    from: email,
    to: "info@alfacycling.com",
    subject: name,
    text: message
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Successfully sent email!");
      res.redirect("contact");
    }
  });
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

//  SPONSORS ROUTE
router.get("/sponsors", (req, res) => {
  res.render("sponsors");
});

//  REGISTER ROUTE
router.get("/register", (req, res) => {
  res.render("register", {
    message: req.flash("registerMessage")
  });
});

router.post("/register", passport.authenticate("local-signup", {
    successRedirect: "/blogs",
    failureRedirect: "/register"
  }),
  (req, res) => {}
);

//  LOGIN ROUTE
router.get("/login", (req, res) => {
  res.render("login", {
    message: req.flash("loginMessage")
  });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//  LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/blogs");
});

//  UPLOAD ROUTE FOR PHOTOS
router.get("/uploadphoto", (req, res) => {
  res.render("uploadphoto");
});

router.post("/uploadphoto", middleware.isModderator, upload.array('images', 12), (req, res) => {
  if (!req.files) {
    req.flash('blogsMessage', "Error with uploading photos!");
    res.redirect("/blogs");
  } else {
    req.flash('blogsMessage', "Photos uploaded successfully!");
    res.redirect("/blogs");
  }
});

module.exports = router;