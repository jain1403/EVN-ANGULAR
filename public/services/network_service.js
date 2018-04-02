var analyticApp=angular.module('myApp');
analyticApp.factory('NetworkCallService', ['$q','$http','$rootScope',function($q,$http,$rootScope) {
	var networkCall = function(request){
		var deferred  = $q.defer();
		var address=$rootScope.address;
		$http({
				method: request.method,
				data: request.data,
				url: request.url,
				headers:request.headers,
				responseType: request.responseType
			}).then(function successCallback(response) {
				deferred.resolve(response.data);
			}, function errorCallback(error) {
				console.error("Data could not Be Retrieved. ERROR: Could not find data source. ");
				deferred.reject(error);
			});
		return deferred.promise;
	};
	return {
		login: function(token){
			var requestObj = {
				method: 'GET',
				url: '/evnCatalog/userInfoDetails'
			}
			return networkCall(requestObj);
		}
	};
}]);