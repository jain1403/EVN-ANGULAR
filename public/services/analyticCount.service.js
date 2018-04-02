(function() {

  angular.module("myApp").factory('AnalyticCountService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
	  
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
	    	analyticCountCall: function(fuel_id,filterBy,token){
				var request = {
					'method': 'GET',
					'url': '/taxanomy/analyticsDashBoardData?fuelId='+fuel_id+'&mode='+filterBy
					};
				return networkCall(request);
			}
	    };
	    
  
  	}]);
})();