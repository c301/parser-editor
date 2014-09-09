var express = require('express');
var app = express();

app.use('', express.static(__dirname + '/src'));

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use('/test', express.static(__dirname + '/test'));

app.listen(process.env.PORT || 3000);
