var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var alarm = require('./alarm');
var controller = require('./controller');

app.use(bodyParser.json());
app.use('/', controller);
app.use('/alarm', alarm);
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});
