var app = angular.module('myApp');
app.factory('sharedData', function($window){
    var list=null;
    var filters={};
    var failures=null;

    var sharedData =
        {
            setAnalyticData: setAnalyticData,
            getAnalyticData: getAnalyticData,
            getAnalyticDataByID: getAnalyticDataByID,
            setFailureData: setFailureData,
            getFailureDataByID: getFailureDataByID
        };

        //save analytic data (called after api call is complete)
    var setAnalyticData = function(data){
            list=data;
      };
      //get saved analytic data.
      var getAnalyticData = function(data){
            return list;
      };
      //get saved analytic data filter to specific analytic ID. (used by analytic page)
      var getAnalyticDataByID = function(data){
          var analyticData=null;
          angular.forEach(list, function(item){
               if (item.analytic_id == data.analytic_id && item.fuel_id == data.fuel_id && item.asset_id == data.asset_id && item.system_id == data.system_id && item.subsystem_id == data.subsystem_id && item.component_id == data.component_id ){
                   analyticData=item;
               }
           });
           return analyticData;
           
      };

    var setFailureData = function(data){
                failures=data;
    };
    var getFailureDataByID = function(data){
          var failureData=null;
          angular.forEach(failures, function(item){
               if (item.failureMasterId == data){
                   failureData=item;
               }
           });
           return failureData;
           
      };

      //save defined analytic filters
      var setAnalyticFilters = function(data){
    	  JSON.strinify(data);
    	  filters=data;
      };
      //get analytic filters previously defined
      var getAnalyticFilters = function(data){
            return filters;
      };
    return {
        setAnalyticData: setAnalyticData,
        getAnalyticData: getAnalyticData,
        getAnalyticDataByID: getAnalyticDataByID,
        setFailureData: setFailureData,
        getFailureDataByID: getFailureDataByID,
        setAnalyticFilters: setAnalyticFilters,
        getAnalyticFilters: getAnalyticFilters

    };

});