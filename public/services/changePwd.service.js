(function() {

  angular.module("myApp").factory('changePwdService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
    	var sampleData;
    	var address=$rootScope.address;
    	var networkCall = function(request){
    		var deferred  = $q.defer();            	
    		$http({
    				method: request.method,
    				url: request.url,
    				data:request.data,
    				headers:request.headers
    			}).then(function successCallback(response) {
    				deferred.resolve(response.data);
    			}, function errorCallback(status, error) {
    				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
    				deferred.reject(error);
    			});
    		return deferred.promise;
    	}
    	    return {
    	    	changePwd: function(data,token){
    				var request = {
    					'method': 'POST',
    					'url':'/evnCatalog/changePwd',
    					'data':data
    					};
    				return networkCall(request);
    			}
    	    };
  }]);
})();