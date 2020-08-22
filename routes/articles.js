const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');

// Bring in Article Model
let Article = require('../models/article');

// Add Route
router.get('/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Add Submit POST Route
router.post('/add', [
  check('title', "Title is required").notEmpty(),
  check('author', "Author is required").notEmpty(),
  check('body', "Body is required").notEmpty()
], function(req, res){

  let errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors.array()
    })
  } else {

    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });

  }

});

// Load Edit Form
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  })
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id: req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id', function(req, res){
  let query = {_id: req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err)
    }
    res.send('Success');
  });
});

// Get Single Article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article: article
    });
  })
});

module.exports = router;