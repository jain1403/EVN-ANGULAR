(function(){
    
    var AnalyticData = function($http){
      
    	var getAnalyticInfo = function(token){
    		
    		return $http.get('/taxanomy/getAnalyticsList')
    		.then(function(response){
    			return response.data; 
    		});
    	};
     
    var getNERCCodeData = function(){
        return $http.get('/evnCatalog/NERCCode')
                    .then(function(response){
                        return response.data;
                    });
    };
      return {
          getAnalyticInfo: getAnalyticInfo,
          getNERCCodeData: getNERCCodeData
      };
        
    };
    var module = angular.module("myApp");
    module.factory("AnalyticData", AnalyticData);
    
}());