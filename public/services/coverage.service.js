(function() {

  angular.module("myApp").factory('coverageDashboardService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
	  
	var sampleData;
	var networkCall = function(request){
		var deferred  = $q.defer();            	
		$http({
				method: request.method,
				url: request.url,
			}).then(function successCallback(response) {
				deferred.resolve(response.data);
			}, function errorCallback(status, error) {
				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
				deferred.reject(error);
			});
		return deferred.promise;
	}
	    return {
			/* Well Info Retrieval Service */
            getFuelLevelData: function(){
				var request = {
					'method': 'GET',
					'url': '/evnCatalog/OverallCoverage'						
					};
				return networkCall(request);
			}
	    };
	    
  
  	}]);
})();