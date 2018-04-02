(function() {

  angular.module("myApp").factory('analyzeCoverageService', ['$q','$rootScope','$http', function($q, $rootScope,$http) {
		var url=$rootScope.url;
    	var sampleData;
    	var networkCall = function(request){
    		var deferred  = $q.defer();            	
    		$http({
    				method: request.method,
    				url: request.url,
    				headers: {
                        'Content-Type': undefined
                    },
    				data:request.data,
    				transformRequest: angular.identity
    			}).then(function successCallback(response) {
    				deferred.resolve(response.data);
    			}, function errorCallback(status, error) {
    				console.error("Data could not Be Retrieved. ERROR: Could not find data source. "+status);
    				deferred.reject(error);
    			});
    		return deferred.promise;
    	}
    	    return {
    	    	analyzeServiceCall: function(data){
    	    		  var fd = new FormData();
    	    		  _.forEach(data,function(data){
    	    			  if(data.format == 'csv')
    	    				  {
    	    				  fd.append('opportunity_file', data.file);
    	    				  }
    	    			  else{
    	    				  fd.append('clean_file', data.file);
    	    			  }
    	    		  });
    				var request = {
    					'method': 'POST',
    					 'url':'http://ec2-52-25-199-162.us-west-2.compute.amazonaws.com:8081/calling',
    					 //'url':'http://3.209.34.59:5709/calling',
    					 'data': fd
    					};
    				return networkCall(request);
    			},
    			testUpload: function(data){
  	    		  var fd = new FormData();
  	    		 fd.append('formattedFile', data[0]);
  				var request = {
  					'method': 'POST',
  					 'url':'/taxanomy/runEventMappingAlgo',
  					 'data': fd
  					};
  				return networkCall(request);
  			}
    	    };
  }]);
})();