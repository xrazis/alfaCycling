var express = require("express"),
  router = express.Router(),
  db = require("../config/db_conn"),
  fs = require("fs"),
  middleware = require("../middleware/user");

const creds = require("../config/creds");

readPhotos = (dir) => {
  let mPhotos = [];
  fs.readdirSync(dir).forEach(file => {
    mPhotos.push(file);
  });
  return mPhotos;
};

//  BLOGS ROUTE
router.get("/", (req, res) => {
  var sql = "SELECT * FROM blogs ORDER BY id LIMIT 50;";
  db.query(sql, (error, blogs) => {
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
router.post("/", middleware.isModderator, (req, res) => {
  var title = req.body.title;
  var subtitle = req.body.subtitle;
  var image = "/img/uploads/" + req.body.image;
  var body = req.body.body;
  var posted_by = req.user.username;
  var galleryPhotos = req.body.galleryPhotos;

  var newBlog = [title, subtitle, image, body, posted_by, posted_by];
  var sql = "INSERT INTO blogs (title,subtitle,image,body,posted_by,edited_by) VALUES (?, ?, ?, ?, ?, ?);";

  db.query(sql, newBlog, (error, blog) => {
    if (error) {
      console.log(error);
    } else {
      var blog_id = blog.insertId;
      var newGallery = [];

      if (Array.isArray(galleryPhotos)) {
        console.log("array");
        [...galleryPhotos].forEach((photo) => {
          newGallery.push([`/img/uploads/${photo}`, blog_id]);
        });
      } else {
        newGallery = [
          ['/img/uploads/' + galleryPhotos, blog_id]
        ];
      }

      var imagesSql = "INSERT INTO images(post_image, blog_id) VALUES ?;";

      db.query(imagesSql, [newGallery], (error, images) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect("/blogs");
        }
      })
    }
  });
});

router.get("/new", middleware.isModderator, (req, res) => {
  let photos = readPhotos('./public/img/uploads/');
  res.render("blogs/new", {
    photos: photos,
    tiny_api: creds.tiny_api
  });
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
  var blog_id = req.params.id;
  if (!blog_id) {
    return res.status(400).send({
      error: true,
      message: "blog_id error"
    });
  }
  var sql =
    "SELECT * FROM blogs LEFT JOIN images ON blogs.id = images.blog_id WHERE blogs.id = ?;";
  db.query(sql, blog_id, (error, foundblog) => {
    if (error) throw error;
    res.render("blogs/show", {
      blog: foundblog,
      blog_id: blog_id,
      currentUser: req.user
    });
  });
});

//  EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn,
  (req, res) => {
    var blog_id = req.params.id;
    var sql =
      "SELECT * FROM blogs LEFT JOIN images ON blogs.id = images.blog_id WHERE blogs.id = ?;";
    db.query(sql, blog_id, (error, foundblog) => {
      if (error) {
        console.log(error);
      } else {
        let photos = readPhotos('./public/img/uploads/');
        res.render("blogs/edit", {
          photos: photos,
          tiny_api: creds.tiny_api,
          blog_id: blog_id,
          blog: foundblog
        });
      }
    });
  });

router.put("/:id", middleware.isLoggedIn, (req, res) => {
  var blog_id = req.params.id;
  var title = req.body.title;
  var headerPhoto = "/img/uploads/" + req.body.headerPhoto;
  var galleryPhotos = req.body.galleryPhotos;
  var body = req.body.body;
  var edited = new Date();
  var edited_by = req.user.username;
  var newGallery = [];

  if (Array.isArray(galleryPhotos)) {
    [...galleryPhotos].forEach((photo) => {
      newGallery.push([`/img/uploads/${photo}`, blog_id]);
    });
  } else {
    newGallery = [
      ['/img/uploads/' + galleryPhotos, blog_id]
    ];
  }

  var upBlog = [blog_id, title, headerPhoto, body, edited, edited_by, blog_id, newGallery];
  var sql = "DELETE FROM images WHERE blog_id = ?;UPDATE blogs SET title = ?, image = ?, body = ?, edited = ?,  edited_by = ? WHERE id = ?; INSERT INTO images (post_image, blog_id) VALUES ?;";

  db.query(sql, upBlog, (error, upblog) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/blogs/" + blog_id);
    }
  });
});

//  DELETE ROUTE
router.delete("/:id", middleware.isModderator, (req, res) => {
  var blog_id = req.params.id;
  var sql =
    "DELETE FROM images WHERE blog_id = ?;DELETE FROM blogs WHERE id = ?;";
  db.query(sql, [blog_id, blog_id], (error) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/blogs");
    }
  });
});

module.exports = router;