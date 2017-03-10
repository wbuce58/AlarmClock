var bodyParser = require('body-parser');
var express = require('express');
var nconf = require('nconf');

var app = express();

var alarm = require('./alarm');
var controller = require('./controller');

app.use(bodyParser.json());
app.use('/', controller);
app.use('/alarm', alarm);
app.use(express.static('public'));

nconf.env('__');

var port = nconf.get('PORT') || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${ port }!`);
});
