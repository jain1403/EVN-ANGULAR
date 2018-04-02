/*
This module reads config settings from localConfig.json when running locally,
  or from the VCAPS environment variables when running in Cloud Foundry.
*/

var settings = {};

	var devConfig = require('./localConfig.json')['development'];
	settings.base64ClientCredential = devConfig.base64ClientCredential;
	settings.clientId = devConfig.clientId;
	settings.uaaURL = devConfig.uaaURL;
	settings.tokenURL = devConfig.uaaURL;
	settings.appURL = devConfig.appURL;
	settings.callbackURL = devConfig.appURL + '/callback';
// This vcap object is used by the proxy module.
settings.buildVcapObjectFromLocalConfig = function(config) {
  'use strict';
	// console.log('local config: ' + JSON.stringify(config));
	var vcapObj = {};
	if (config.uaaURL) {
		vcapObj['predix-uaa'] = [{
			credentials: {
				uri: config.uaaURL
			}
		}];
	}
	return vcapObj;
};

module.exports = settings;
