'use strict';

var port = 9000;
var express = require('express');

var app = express();

app.use('/', express.static( __dirname + '/public' ) );

app.listen( process.env.PORT || port, function() {
  console.log('Server started on port ' + port);
});
