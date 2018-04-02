(function() {

  angular.module("myApp").factory('csvService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
		var url=$rootScope.url;
    	var sampleData;
    	var networkCall = function(request,fileName){
    		var deferred  = $q.defer();            	
    		$http({
    				method: request.method,
    				url: request.url,
    				headers:request.headers,
    				responseType: 'arraybuffer'
    		}).then(function successCallback(response) {
    				deferred.resolve(response.data);
    				  var blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    				    saveAs(blob, fileName + '.xlsx');
    			}, function errorCallback(status, error) {
    				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
    				deferred.reject(error);
    			});
    		return deferred.promise;
    	}
    	    return {
    	    	downloadTemplate: function(){
    	    		var requestObj = {
    	    				method:"GET",
    	    				url: "/csv/APM.xlsx",
    	    				headers: {
    	    				       'Content-type': 'application/json'
    	    				    }
    	    			}
    				return networkCall(requestObj,"APM");
    			},
    			downloadTemplateBacklog: function(){
    	    		var requestObj = {
    	    				method:"GET",
    	    				url: "/csv/Pipeline.xlsx",
    	    				headers: {
    	    				       'Content-type': 'application/json'
    	    				    }
    	    			}
    				return networkCall(requestObj,"Backlog");
    			}
    	    };
  }]);
})();