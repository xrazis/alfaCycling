var express = require("express"),
  router = express.Router(),
  db = require("../config/db_conn"),
  middleware = require("../middleware/user");

const creds = require("../config/creds");

//  BLOGS ROUTE
router.get("/", function (req, res) {
  var sql = "SELECT * FROM blogs ORDER BY id LIMIT 50;";
  db.query(sql, function (error, blogs) {
    if (error) {
      res.render("error");
    } else {
      res.render("blogs/blogs", {
        blogs: blogs,
        currentUser: req.user,
        message: req.flash("blogsMessage")
      });
    }
  });
});

// NEW ROUTE
router.post("/", middleware.isModderator, function (req, res) {
  var title = req.body.title;
  var subtitle = req.body.subtitle;
  var image = req.body.image;
  var body = req.body.body;
  var posted_by = req.user.username;

  var newBlog = [title, subtitle, image, body, posted_by, posted_by];

  var sql = "INSERT INTO blogs (title,subtitle,image,body,posted_by,edited_by) VALUES (?, ?, ?, ?, ?, ?);";
  db.query(sql, newBlog, function (error, blog) {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/blogs");
    }
  });
});

router.get("/new", middleware.isModderator, function (req, res) {
  res.render("blogs/new", {
    tiny_api: creds.tiny_api
  });
});

// SHOW ROUTE
router.get("/:id", function (req, res) {
  var blog_id = req.params.id;
  if (!blog_id) {
    return res.status(400).send({
      error: true,
      message: "blog_id error"
    });
  }
  var sql =
    "SELECT * FROM blogs LEFT JOIN images ON blogs.id = images.blog_id WHERE blogs.id = ?;";
  db.query(sql, blog_id, function (error, foundblog) {
    if (error) throw error;
    res.render("blogs/show", {
      blog: foundblog,
      blog_id: blog_id,
      currentUser: req.user
    });
  });
});

//  EDIT ROUTE
router.get("/:id/edit", middleware.isModderator,
  function (req, res) {
    var blog_id = req.params.id;
    var sql =
      "SELECT * FROM blogs LEFT JOIN images ON blogs.id = images.blog_id WHERE blogs.id = ?;";
    db.query(sql, blog_id, function (error, Foundblog) {
      if (error) {
        console.log(error);
      } else {
        console.log(Foundblog);
        res.render("blogs/edit", {
          tiny_api: creds.TINY_API,
          blog: Foundblog
        });
      }
    });
  });

router.put("/:id", middleware.isModderator, function (req, res) {
  var blog_id = req.params.id;
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var edited = new Date();
  var edited_by = req.user;

  var upBlog = [title, image, body, blog_id, edited, edited_by];

  var sql = "UPDATE blogs SET title = ?, image = ?, body = ?, edited = ?,  edited_by = ? WHERE id = ?;";
  db.query(sql, upBlog, function (error, upblog) {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/blogs/" + blog_id);
    }
  });
});

//  DELETE ROUTE
router.delete("/:id", middleware.isModderator, function (req, res) {
  var blog_id = req.params.id;
  var sql =
    "DELETE FROM images WHERE images.blog_id = ?;DELETE FROM blogs WHERE blogs.id = ?;";
  db.query(sql, [blog_id, blog_id], function (error) {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/blogs");
    }
  });
});

module.exports = router;