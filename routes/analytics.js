var express = require('express');
var request = require("request");

var router = express.Router();

router.get('/', function(req, res, next) {

  var request = require("request");

  var options = {
    method: 'GET',
    url: 'http://localhost:9000/json/sample-taxonomy.json'
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.send(JSON.parse(body));
  });

});

module.exports = router;
