// var Bookshelf = require('bookshelf');
// var path = require('path');

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

  //USERS
  exports.userSchema = new mongoose.Schema({
    // id: Number,
    username: String,
    password: String,
    timestamp: Date
  });
  exports.userSchema.methods.hashPassword = function (callback) {
    var that = this;
    bcrypt.hash(this.password, null, null, function (err, hash) {
        if(err) {
          console.log('ERROR/hashPassword:', err)
        }
        that.password = hash;
        callback(that);
      });

  }
  exports.userSchema.methods.comparePassword = function (attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function (err, isMatch) {
      if(err) {
        console.log('ERROR/comparePassword:', err);
      } else {
        callback(isMatch);
      }
    })
  }
  exports.User = mongoose.model('User', exports.userSchema);
  
  //URLS
  exports.urlSchema = new mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number,
    timestamp: Date
  }) 
  exports.urlSchema.methods.setCode = function (callback) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.get('url'));
    this.code = shasum.digest('hex').slice(0, 5);
    callback(this);
  }
  exports.Url = mongoose.model('Url', exports.urlSchema);
});

