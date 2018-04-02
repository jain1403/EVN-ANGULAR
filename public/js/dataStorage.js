var app = angular.module('myApp');
app.factory('dataStorage', function($window){
    var pipeLineData=null;
    var filters={};
    var failures=null;
    var fuelId={};
    var filterData={};
    var barChartClick=false;
    var sharedData =
        {
            setAnalyticPiplineData: setAnalyticPiplineData,
            getAnalyticPiplineData: getAnalyticPiplineData,
            getAnalyticDataByID: getAnalyticDataByID,
            setFailureData: setFailureData,
            getFailureDataByID: getFailureDataByID,
            setFuelId: setFuelId,
            getFuelId: getFuelId,
            setFiltersData: setFiltersData,
            getFiltersData: getFiltersData,
            setbarChartClick: setbarChartClick,
            getbarChartClick: getbarChartClick
        };
    var setAnalyticPiplineData = function(data){
    	pipeLineData=data;
      };
      var getAnalyticPiplineData = function(data){
            return pipeLineData;
      };
      var setFiltersData = function(data){
    	  filterData=data;
        };
        var getFiltersData = function(data){
              return filterData;
        };
      var setFuelId = function(Id){
    	  fuelId=Id;
        };
        var getFuelId = function(){
            return fuelId;
      };
      var setbarChartClick = function(value){
    	  barChartClick=value;
        };
        var getbarChartClick = function(){
            return barChartClick;
      };
      var getAnalyticDataByID = function(data){
          var analyticData=null;
          angular.forEach(list, function(item){
               if (item.analytic_id == data){
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

      var setAnalyticFilters = function(data){
            filters=data;
      };

      var getAnalyticFilters = function(data){
            return filters;
      };
    return {
    	setAnalyticPiplineData: setAnalyticPiplineData,
    	getAnalyticPiplineData: getAnalyticPiplineData,
        getAnalyticDataByID: getAnalyticDataByID,
        setFailureData: setFailureData,
        getFailureDataByID: getFailureDataByID,
        setAnalyticFilters: setAnalyticFilters,
        getAnalyticFilters: getAnalyticFilters,
        setFuelId: setFuelId,
        getFuelId: getFuelId,
        setFiltersData: setFiltersData,
        getFiltersData: getFiltersData,
        setbarChartClick: setbarChartClick,
        getbarChartClick: getbarChartClick

    };

});