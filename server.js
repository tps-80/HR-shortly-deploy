var app = require('./server-config.js');

var port;

if(process.env.NODE_ENV === 'development') {
//need to set this on local machine. export NODE_ENV=developement
  port = 4568; 
} else {
  port = process.env.PORT;
}

app.listen(port);

console.log('Server now listening on port ' + port);
