const express = require('express'),
  router = express.Router();

const creds = require('../../config/keys');
const upload = require('../../actions/img_actions');

const { requireAuth } = require('../../middlewares/middlewares');
const { insertToDatabase, updateDatabase, deleteFromDatabase, showAllFromDatabase, getOneFromDatabase } = require('../../actions/db_actions_blogs');

router.get('/blogs', async (req, res) => {
  res.render('blogs/blogs', {
    blogs: await showAllFromDatabase()
  });
});

router.post('/blogs', requireAuth, upload.single('image'), async (req, res) => {
  const blog_id = await insertToDatabase(req);

  res.redirect('/blogs/' + blog_id);
});

router.get('/blogs/new', requireAuth, (req, res) => {
  res.render('blogs/new', {
    tiny_api: creds.tiny_api
  });
});

router.get('/blogs/:id', async (req, res) => {
  res.render('blogs/show', {
    blog: await getOneFromDatabase(req.params.id),
    blog_id: req.params.id
  });
});

router.get('/blogs/:id/edit', requireAuth, async (req, res) => {
  res.render('blogs/edit', {
    tiny_api: creds.tiny_api,
    blog_id: req.params.id,
    blog: await getOneFromDatabase(req.params.id)
  });
});

router.put('/blogs/:id', requireAuth, upload.single('image'), async (req, res) => {
  await updateDatabase(req);

  res.redirect('/blogs/' + req.params.id);
});

router.delete('/blogs/:id', requireAuth, async (req, res) => {
  await deleteFromDatabase(req.params.id);

  res.redirect('/admin-panel');
});

module.exports = router; 