(function() {

  angular.module("myApp").factory('analyticsPipelineService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
		var url=$rootScope.url;
    	var sampleData;
    	var networkCall = function(request){
    		var deferred  = $q.defer();            	
    		$http({
    				method: request.method,
    				url: request.url,
    				headers:request.headers,
    			}).then(function successCallback(response) {
    				deferred.resolve(response.data);
    			}, function errorCallback(status, error) {
    				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
    				deferred.reject(error);
    			});
    		return deferred.promise;
    	}
    	    return {
    	    	analyticServiceCall: function(token){
    				var request = {
    					'method': 'GET',
    					'url':'/taxanomy/getAnalyticsPipelineData'
    					};
    				return networkCall(request);
    			}
    	    };
  }]);
})();