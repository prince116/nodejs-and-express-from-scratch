const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in Article Model
let User = require('../models/user');
const { route } = require('./users');

// Register Form
router.get('/register', function(req, res){
  res.render('register', {
    title: 'Register'
  });
});

// Register Process
router.post('/register', [
  check('name', "Name is required").notEmpty(),
  check('email', "Email is required").notEmpty(),
  check('email', "Email is not valid").isEmail(),
  check('username', "Username is required").notEmpty(),
  check('password', "Password is required").notEmpty(),
  check('password2', "Passwords do not match").custom((value, {req}) => value === req.body.password)
], function(req, res){
  
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('register', {
      title: 'Register',
      errors: errors.array()
    })
  } else {

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }

});

// Login Form
router.get('/login', function(req, res){
  res.render('login', {
    title: 'Login'
  });
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out.');
  res.redirect('/users/login');
});

module.exports = router;