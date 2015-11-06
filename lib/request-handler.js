var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  db.Url.find({}, function(err, users) {
    if(err) {console.log('ERROR/fetchLinks:', err)}
    res.send(200, users);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  //Query link
  db.Url.findOne({'url': uri}).exec(function (err, url) {
    if(err) {
      console.log('ERROR/saveLink1:', err);
      res.send(404);
    }
    if(url === null) {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newUrl = new db.Url({
          url: uri,
          visits:0,
          title: title,
          base_url: req.headers.origin,
          timestamp: new Date
        });
        newUrl.setCode(function (link) {
          link.save(function(err) {
            if (err) {
              console.log('ERROR/saveLink2:', err);
              res.send(404);
            } else {
              res.send(201, link);
            }
          });
        });

  
      });
    } else {
      res.send(200, url);
    }
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({'username': username}, function(err, user) {
    if(err) {
      console.log('ERROR/login:', err);
    }
    if (user === null) {
      res.redirect('/login');
    } else {
        console.log('attempted:', password, '\nhash:', user.password)
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
    }
  });
}

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  db.User.findOne({'username': username}, function (err, user) {
    if(err) {
      console.log('ERROR/signup:', err);
    }
    if(user === null) {
      // make a new user
      var newUser = new db.User({
        username: username,
        password: password,
        timestamp: new Date
      });
      newUser.hashPassword(function (user) {
        user.save(function (err) {
          util.createSession(req, res, user);
          res.send(201, user);
        });
      });


    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  db.Url.findOne({ code: req.params[0]}, function(err, link) {
    if(err) {
      console.log('ERROR/nav1:', err);
    }
    if(!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err){
        if (err) {
          console.log('ERROR/nav2:', err)
        } else {
          res.redirect(link.url);
        }
      });
    }
  }); 
};










