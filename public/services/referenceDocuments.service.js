(function() {

  angular.module("myApp").factory('referenceDocumentsService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
		var url=$rootScope.url;
    	var sampleData;
    	var networkCall = function(request){
    		var deferred  = $q.defer();            	
    		$http({
    				method: request.method,
    				url: request.url
    			}).then(function successCallback(response) {
    				deferred.resolve(response.data);
    			}, function errorCallback(status, error) {
    				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
    				deferred.reject(error);
    			});
    		return deferred.promise;
    	}
    	    return {
    	    	referenceDataCall: function(token){
    				var request = {
    					'method': 'GET',
    					'url': '/taxanomy/referenceData'
    					};
    				return networkCall(request);
    			}
    	    
    	    };
  }]);
})();