(function() {
  'use strict';

  angular.module("myApp")
    .controller('coverageHomeCtrl',['$scope','coverageDashboardService','$state','$rootScope','NetworkCallService', function ($scope,coverageDashboardService,$state,$rootScope,NetworkCallService) {
    	
    	$rootScope.currentParent=$state.current.name;
    	sessionStorage.setItem('currentPage',$state.current.name);
    	$(window).off('resize');
    	function resize(){
			if($state.current.name == "home"){
				
    	    		var newWidth=$(window).width();
    	    		var newHeight=$(window).height()-64;
    	    		document.getElementById('mainDiv').style.width=newWidth+'px';
    	    		document.getElementById("mainDiv").style.height = newHeight+"px";
            	}
		}
		
    	setTimeout(function(){resize()},200);
    	$(window).on('resize',function() {
    		setTimeout(function(){resize()},200);
		});
    	
    	$scope.apmClick=function(){
    		$state.go('coverage.analyticDashboard');
    	}
    	
    }]);
})();