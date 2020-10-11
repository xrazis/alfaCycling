const express = require('express'),
  router = express.Router();

const transporter = require('../config/mailerConn');

const { showAllFromDatabase } = require('./blogs/dbActions');

router.get('/', (req, res) => {
  res.redirect('/index');
});

router.get('/index', async (req, res) => {
  res.render('index', {
    blogs: await showAllFromDatabase(1)
  });
});

router.get('/gallery', (req, res) => {
  res.render('gallery');
});

router.get('/about-us', (req, res) => {
  res.render('about-us');
});

router.post('/contact-us', (req, res) => {
  const { email, name, message } = req.body;

  const mail = {
    from: email,
    to: 'dev@xrazis.com',
    subject: name,
    text: message
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('contact-us');
    }
  });
});

router.get('/contact-us', (req, res) => {
  res.render('contact-us');
});

router.get('/sponsors', (req, res) => {
  res.render('sponsors');
});

module.exports = router;