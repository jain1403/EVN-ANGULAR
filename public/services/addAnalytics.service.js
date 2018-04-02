(function() {

  angular.module("myApp").factory('addAnalyticsService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
		var url=$rootScope.url;
    	var sampleData;
    	var networkCall = function(request){
    		var deferred  = $q.defer();            	
    		$http({
    				method: request.method,
    				url: request.url,
    				headers:request.headers,
    				data:request.data,
    			}).then(function successCallback(response) {
    				deferred.resolve(response.data);
    			}, function errorCallback(status, error) {
    				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
    				deferred.reject(error);
    			});
    		return deferred.promise;
    	}
    	    return {
    	    	userEntryCall: function(token){
    				var request = {
    					'method': 'GET',
    					'url': '/taxanomy/getUserEntryData'
    					};
    				return networkCall(request);
    			},
    			fuelTypeAndAssetCall: function(token){
    				var request = {
    					'method': 'GET',
    					'url': '/taxanomy/getFuelTypeAndAsset'					
    					};
    				return networkCall(request);
    			},
    			systemLevelCall: function(assetId,token){
    				var request = {
    					'method': 'GET',
    					'url':  '/taxanomy/getSystemAndSubsys?assetId='+assetId
    					};
    				return networkCall(request);
    			},
    			componentLevelCall: function(subsystmId,token){
    				var request = {
    					'method': 'GET',
    					'url': '/taxanomy/getComponentList?subSysId='+subsystmId	
    					};
    				return networkCall(request);
    			},
    			saveAnalyticCall: function(data,token){
    				//var url='https://w3yrpha24g.execute-api.us-west-2.amazonaws.com/dev/AddAnalytics?analyticName='+data.analyticName+'&bluePrintName='+data.bluePrintName+'&analyticCatalog='+data.analyticCatalog+'&analyticDes='+data.analyticDes+'&analyticOwner='+data.analyticOwner+'&analyticDocName='+data.analyticDocName+'&applicationDes='+data.applicationDes+'&rpn='+data.rpn+'&leadTime='+data.leadTime+'&analyticOutcome='+data.analyticOutcome+'&pod='+data.pod+'&fa='+data.fa+'&remark='+data.remark+'&analyticSources='+data.analyticSources+'&analyticPlatform='+data.analyticPlatform+'&analyticApplication='+data.analyticApplication.join(",")+'&analyticTechniques='+data.analyticTechniques+'&analyticReadiness='+data.analyticReadiness+'&aws_status='+data.aws_status+'&prdeixReadiness='+data.prdeixReadiness+'&coverageFlag='+data.coverageFlag+'&inputTag='+data.inputTag.join(",")+'&fuelId='+data.fuelId+'&assetId='+data.assetId+'&systemId='+data.systemId+'&subSystemIdSelected='+data.subSystemIdSelected+'&compIdSelected='+data.compIdSelected+'&nercCodeSelected='+data.nercCodeSelected+'&nercCauseCode='+data.nerc_cause_code;
    				var request = {
    					 'method': 'POST',
    					 'url': '/taxanomy/uploadAnalytics',
    					 'data':data
    					};
    				return networkCall(request);
    			},
    			bulkAnalyticCall: function(data,token){
    				var url='/evnCatalog/AddAnalytics?analyticName='+data.analytic_name+'&bluePrintName='+data.blueprint_name+'&analyticCatalog='+data.analytic_catalog_name+'&analyticDes='+data.analytic_description+'&analyticOwner='+data.analytic_owner+'&analyticDocName='+data.analytic_document_link+'&applicationDes='+data.application_description+'&rpn='+data.rpn+'&leadTime='+data.leadTime+'&analyticOutcome='+data.analytic_outcome+'&pod='+data.pod+'&fa='+data.fa+'&remark='+data.remark+'&analyticSources='+data.analytic_source+'&analyticPlatform='+data.analytic_platform+'&analyticApplication='+data.analytics_application+'&analyticTechniques='+data.analytic_techniques+'&analyticReadiness='+data.analytic_readiness+'&aws_status='+data.aws_status+'&prdeixReadiness='+data.predix_readiness+'&coverageFlag='+data.coverage_flag+'&inputTag='+data.analytic_input_tags+'&nercCodeSelected='+data.nerc_failure_code+'&nercCauseCode='+data.nerc_cause_code;
    				console.log(url);
    				var request = {
    					 'method': 'GET',
    					 'url': url
     					
    					};
    				return networkCall(request);
    			},
    			saveBacklogCall: function(data,token){
    			//	var url='https://w3yrpha24g.execute-api.us-west-2.amazonaws.com/dev/AddBacklog?backlogName='+data.backlogName+'&backlogDesc='+data.backlogDesc+'&backlogTeam='+data.backlogTeam+'&backlogOwner='+data.backlogOwner+'&backlogStatus='+data.backlogStatus+'&backlogApplication='+data.backlogApplication+'&backlogSource='+data.backlogSource+'&backlogTarget='+data.backlogTarget+'&backlogComment='+data.backlogComment+'&backlogOutcome='+data.backlogOutcome+'&coverageFlag='+data.coverageFlag+'&backlogUserstory='+data.backlogUserstory+'&fuelId='+data.fuelId+'&assetId='+data.assetId+'&systemId='+data.systemId+'&subSystemIdSelected='+data.subSystemIdSelected+'&compIdSelected='+data.compIdSelected+'&nercCodeSelected='+data.nercCodeSelected+'&nercCauseCode='+data.nerc_cause_code;
    			//	console.log(url);
    				var request = {
    						'method': 'POST',
    						'url': '/taxanomy/uploadBacklog',
    						'data':data											
    				};
    				return networkCall(request);
    			},
    			bulkBacklogCall: function(data,token){
    				var url='/evnCatalog/AddBacklog?backlogName='+data.backlog_name+'&backlogDesc='+data.backlog_description+'&backlogTeam='+data.backlog_team+'&backlogOwner='+data.backlog_owner+'&backlogStatus='+data.backlog_status+'&backlogApplication='+data.backlog_application+'&backlogSource='+data.backlog_source+'&backlogTarget='+data.backlog_target+'&backlogComment='+data.backlog_comment+'&backlogOutcome='+data.backlog_outcome+'&coverageFlag='+data.coverage_flag+'&backlogUserstory='+data.backlog_user_story+'&nercCodeSelected='+data.nerc_failure_code+'&nercCauseCode='+data.nerc_cause_code;
    				var request = {
    					 'method': 'GET',
    					'url': 	url    										
    					};
    				return networkCall(request);
    			},
    			getSuggestion: function(name,data,type){
    				var request = {
    					 'method': 'GET',
    					 'url':'/taxanomy/getSuggestions?mode='+name+'&search='+data+'&type='+type
    					};
    				return networkCall(request);
    			},
    			updateAnalyticCall: function(data,To){
    				//var url='https://w3yrpha24g.execute-api.us-west-2.amazonaws.com/dev/AddAnalytics?analyticName='+data.analyticName+'&bluePrintName='+data.bluePrintName+'&analyticCatalog='+data.analyticCatalog+'&analyticDes='+data.analyticDes+'&analyticOwner='+data.analyticOwner+'&analyticDocName='+data.analyticDocName+'&applicationDes='+data.applicationDes+'&rpn='+data.rpn+'&leadTime='+data.leadTime+'&analyticOutcome='+data.analyticOutcome+'&pod='+data.pod+'&fa='+data.fa+'&remark='+data.remark+'&analyticSources='+data.analyticSources+'&analyticPlatform='+data.analyticPlatform+'&analyticApplication='+data.analyticApplication.join(",")+'&analyticTechniques='+data.analyticTechniques+'&analyticReadiness='+data.analyticReadiness+'&aws_status='+data.aws_status+'&prdeixReadiness='+data.prdeixReadiness+'&coverageFlag='+data.coverageFlag+'&inputTag='+data.inputTag.join(",")+'&fuelId='+data.fuelId+'&assetId='+data.assetId+'&systemId='+data.systemId+'&subSystemIdSelected='+data.subSystemIdSelected+'&compIdSelected='+data.compIdSelected+'&nercCodeSelected='+data.nercCodeSelected+'&nercCauseCode='+data.nerc_cause_code;
    				var request = {
    					 'method': 'POST',
    					 'url': '/taxanomy/'+To,
    					 'data':data
    					};
    				return networkCall(request);
    			}
    			
    	    };
  }]);
})();