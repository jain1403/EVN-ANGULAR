'use strict';
var express = require('express');
var request = require('request-promise');
var MicroServiceSeed = express();
var proxy = require('express-request-proxy');
var MicroServiceSeedPath = process.env.MICRO_SERVICE_PROXY_URL;
// var validator = require('./Validator');


// - set a timeout
/*
MicroServiceSeed.get('/v1/pds/hello', (req, res, next) => {
    console.log(JSON.stringify(req.headers));
    res.send('Fake text');
    proxy({
        url: MicroServiceSeedPath + '/v1/pds/hello',
    timeout: parseInt(req.headers.timeout) || 60000, // If there's a timeout header on the request, honor it
    originalQuery:  req.originalUrl.indexOf('?') >= 0
})(req, res, next);
});
*/

module.exports = MicroServiceSeed;
