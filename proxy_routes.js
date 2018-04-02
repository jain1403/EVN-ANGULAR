var proxyMiddleware = require('http-proxy-middleware');
proxy_router_config = require('./proxy_route_config'),
agent = require('https-proxy-agent'),
proxyAgent = require('./proxy'),
_ = require('lodash'),
expressProxy = require('express-http-proxy');
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
var addUserTokenToRequest = function(req, res, next) {
	if(req.session!==undefined && req.session!==null){
		if(checkNullAndUndefined(req.session, 'passport')){
			if(checkNullAndUndefined(req.session.passport, 'user')){
				if(checkNullAndUndefined(req.session.passport.user, 'ticket')){
						if(checkNullAndUndefined(req.session.passport.user.ticket, 'access_token')){
							return 'bearer %s'.replace('%s', req.session.passport.user.ticket.access_token);
					}	
				}
			}
		}
	}
}
var setPathProxies = function(configurationObject){
	var app = configurationObject.app;
	//Environment based path proxying.
	var environment = configurationObject.environment;
	if(environment!==null && environment!==undefined){
		environment = environment.toString().toLowerCase();
	}else{
		//Default Environment
		environment = "development";
	}
	console.info("Setting up proxy middleware for: %s environment".replace("%s", environment));
	var proxyConfig = proxy_router_config.proxyConfig;
	proxyConfig = proxyConfig[environment];
	_.forEach(Object.keys(proxyConfig), function(toPath){
		if(proxyConfig[toPath]) {
	  // var corporateProxyServer = process.env.http_proxy || process.env.HTTP_PROXY    || process.env.HTTPS_PROXY ||  process.env.https_proxy;
		 var apiProxyContext = toPath;
		 var newContext = '^'+toPath;
		 var pathRewrite = {};
		 pathRewrite[newContext]= '';
		 var apiProxyOptions = {
			target:proxyConfig[toPath],
			changeOrigin:true,
			logLevel: 'debug',
			pathRewrite: pathRewrite,
			onError(err, req, res) {
				res.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				res.end(err.code);
			},	
			onProxyReq: function onProxyReq(proxyReq, req, res, next) {
				
			},
			onProxyReqWs: function onProxyReqWs(proxyReq, req, socket, options, head) {
				
			},
			onProxyRes: function(proxyRes, req, res) {
				//Set Additional Headers
				proxyRes.headers['X-Metadata'] = 'Created By Capgemini';
				proxyRes.headers['X-Powered-By'] = 'Predix';
				delete proxyRes.headers['x-removed'];       // remove header from response
			}
		 };
	 
		// if (corporateProxyServer && proxyConfig[toPath].indexOf('https')!==-1) {
			// apiProxyOptions.agent = new agent(corporateProxyServer);
		// } 
		if(configurationObject.uaaIsConfigured){
			//Set Proxy Headers
			app.use(toPath, configurationObject.passport.authenticate('main', {noredirect: true}), function(req, res, next){
				req.headers["Authorization"] = addUserTokenToRequest(req);
				console.log("the header: ",JSON.stringify(req.headers['Authorization']));
				//console.log("the SSO: ",JSON.stringify(req.headers['Requested-By']));
				next();
			});
		}
		//Use Proxy Middleware
		app.use(proxyMiddleware(apiProxyContext,apiProxyOptions));
	 }
	});
} 
 module.exports = {
	setPathProxies: setPathProxies
};
