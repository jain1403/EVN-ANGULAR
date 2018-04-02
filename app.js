const debug = require('debug')('evn:main')  
const name = 'EVN Migration'
const defaultTimeout = 500000;  
//Setup Express Server
var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser'); // used for session cookie
//var bodyParser = require('body-parser');
var passport;  // only used if you have configured properties for UAA
// simple in-memory session is used here. use connect-redis for production!!
var session = require('express-session');
var proxy = require('./proxy'); // used when requesting data from real services.
// get config settings from local file or VCAPS env var in the cloud
var config = require('./predix-config');
// configure passport for authentication with UAA
var passportConfig = require('./passport-config');
var proxy_route_config = require('./proxy_route_config');
var compression = require('compression');
// if running locally, we need to set up the proxy from local config file:

var ip = require("ip");
var devConfig = require('./localconfig.json')['development'];
proxy.setServiceConfig(config.buildVcapObjectFromLocalConfig(devConfig));
proxy.setUaaConfig(devConfig);

var windServiceURL = devConfig ? devConfig.windServiceURL : process.env.windServiceURL;
debug('Botting application %s', name);

var uaaIsConfigured = config.clientId &&
    config.uaaURL &&
    config.uaaURL.indexOf('https') === 0 &&
    config.base64ClientCredential;
if (uaaIsConfigured) {
	passport = passportConfig.configurePassportStrategy(config);
}
debug('Is UAA Configured?: %s', uaaIsConfigured);
/**********************************************************************
       SETTING UP EXRESS SERVER
***********************************************************************/
var app = express();
app.use('/node_modules', express.static('node_modules'));
app.use('/bower_components', express.static('bower_components'));
app.set('trust proxy', 1);
app.use(cookieParser('evn'));

debug("Using in memory session storage.");
app.use(session({
	secret: 'evn',
	name: 'evn_session',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
if (uaaIsConfigured) {
  app.use(passport.initialize());
  // Also use passport.session() middleware, to support persistent login sessions (recommended).
  app.use(passport.session());
}
//GZIP Everything
debug("Enabling GZIP Compression.");
app.use(compression()); 
//Initializing application modules
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//Use middleware for proxy.
var configurationObject = {app: app, uaaIsConfigured: uaaIsConfigured, passport: passport, environment: 'development'};
const proxy_routes=require('./proxy_routes');
proxy_routes.setPathProxies(configurationObject);

var server = app.listen(9000, function () {
	debug("Application Booting complete on %s", server.address().port);
	console.log ('Server started on port: ' + server.address().port);
});

var checkNullAndUndefined = function(data, key){
	try{
		if(data!==null && data!==undefined){
			if(key!==null &&  key!==undefined){
				if(data[key]!==null && data[key]!==undefined){
					return true;
				}else{
					throw new Error('data[%s] is undefined'.replace('%s', key));
				}
			}else{
				throw new Error('Key is undefined');
			}
		}else{
			throw new Error('Data is undefined');
		}
	}catch(err){
		return false;
	}	
}
var parseJwt = function  (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	var buf = {}
	if (typeof Buffer.from === "function") {
		// Node 5.10+
		buf = Buffer.from(base64, 'base64'); // Ta-da
	} else {
		// older Node versions
		buf = new Buffer(base64, 'base64'); // Ta-da
	}

	return JSON.parse(buf);
};
/****************************************************************************
	SET UP EXPRESS ROUTES
*****************************************************************************/

if (!uaaIsConfigured) { // no restrictions
	console.log("Hweweeww",process.env['base-dir']);
  app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '/public')));
} else {
  //login route redirect to predix uaa login page
  app.get('/login',passport.authenticate('predix', {'scope': ''}), function(req, res) {
    // The request will be redirected to Predix for authentication, so this
    // function will not be called.
  });
  //callback route redirects to secure route after login
  app.get('/callback', passport.authenticate('predix', {
  	failureRedirect: '/'
  }), function(req, res) {
  	console.log('Redirecting to secure route...');
  	res.redirect('/');
    });

  // example of calling a custom microservice.
  if (windServiceURL && windServiceURL.indexOf('https') === 0) {
    app.get('/windy/*', passport.authenticate('main', { noredirect: true}),
      // if calling a secure microservice, you can use this middleware to add a client token.
      // proxy.addClientTokenMiddleware,
	proxy.customProxyMiddleware('/windy', windServiceURL)
    );
  }

  //Use this route to make the entire app secure.  This forces login for any path in the entire app.
  app.use('/', passport.authenticate('main', {
    noredirect: false //Don't redirect a user to the authentication page, just show an error
    }),
    express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '/public'))
  );
  
  //Or you can follow this pattern to create secure routes,
  // if only some portions of the app are secure.
  app.get('/secure', passport.authenticate('main', {
    noredirect: true //Don't redirect a user to the authentication page, just show an error
    }), function(req, res) {
    // modify this to send a secure.html file if desired.
    res.send('<h2>This is a sample secure route.</h2>');
  });
    
  app.get('/userinfo', function(req, res) {
	  //console.log(parseJwt(req.session.passport.user.ticket.access_token));
	  console.log("Token:",req.session.passport.user.ticket.access_token);
	if(req.session!==undefined && req.session!==null){
		if(checkNullAndUndefined(req.session, 'passport')){
			if(checkNullAndUndefined(req.session.passport, 'user')){
				if(checkNullAndUndefined(req.session.passport.user, 'ticket')){
					if(checkNullAndUndefined(req.session.passport.user.ticket, 'access_token')){
						try{
							//var token = parseJwt(req.session.passport.user.ticket.access_token)
							var token = req.session.passport.user.ticket.access_token;
							
							//console.log("myssss",token.user_name)
						
							res.status(200);
							res.json(token);
						}catch(err){
							res.status(400);
							res.send(err);
						}
					}
				}
			}
		}
	}
	});

}
console.log('UAA Configured', uaaIsConfigured);

//logout route
app.get('/logout', function(req, res) {
	console.log("In Logout", config.uaaURL);
	req.session.destroy();
	//req.logout();
	passportConfig.reset(); //reset auth tokens
	res.redirect(config.uaaURL + '/logout?redirect=https://affiliateservices.stage.gecompany.com/logoff/logoff.jsp')
  //res.redirect(config.uaaURL + '/logout?redirect=' + config.appURL);
});


app.get('/favicon.ico', function (req, res) {
	res.send('favicon.ico');
});


// Sample route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
//currently not being used as we are using passport-oauth2-middleware to check if
//token has expired
/*
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
*/

////// error handlers //////
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: err
		});
	}
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}

});

module.exports = app;
