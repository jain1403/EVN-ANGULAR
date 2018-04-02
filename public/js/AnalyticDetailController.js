 (function() {

    var app = angular.module('myApp');


    var AnalyticDetailController = function($scope, $stateParams, AnalyticData, sharedData, $window) {
	    // get the id
        var onComplete = function(data) {
            $scope.analyticdata = data.body;
            //store downloaded analytic data is service.
            sharedData.setAnalyticData($scope.analyticdata);
            //set analytic card style to regular so it is not blured when returning to catalog.
            $scope.catcardstyle = "cat-card";
            $scope.analyticdata = sharedData.getAnalyticDataByID($stateParams.analyticObj);
            AnalyticData.getNERCCodeData().then(onCompleteNERC, onError);
        };
        var onCompleteNERC = function(data) {
            $scope.nercdata = data.body;
            sharedData.setFailureData($scope.nercdata);
            $scope.nercdata=sharedData.getFailureDataByID($scope.analyticdata.failure_id);
        };
        var onError = function(reason) {
            $scope.error = "Could not fetch the data.";
        };
        //reset scroll to top of page.
        $window.scrollTo(0, 0);

        //handle tab for sample output json/graph
    $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
        $scope.nercdata=[];
        //get analytic ID from URL.
        $scope.id = $stateParams.analyticID;

        $scope.analyticdata = sharedData.getAnalyticDataByID($stateParams.analyticObj);

        if($scope.analyticdata==null){
            AnalyticData.getAnalyticInfo().then(onComplete, onError);
        }
        else{
            AnalyticData.getNERCCodeData().then(onCompleteNERC, onError);
        }
	};
    app.controller('AnalyticDetailController', AnalyticDetailController);

}());