var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', homePage);
router.get('/all', allAlarms);

function homePage(req, res) {
    res.sendFile(__dirname + '/public/index.html');
}

function allAlarms(req, res){
    res.sendFile(__dirname + '/public/allAlarms.html')
}

module.exports=router;