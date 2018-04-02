(function() {
  'use strict';

  angular.module("myApp")
    .controller('analyticDashboard',['$scope','coverageDashboardService','$state','$rootScope','NetworkCallService','$timeout', function ($scope,coverageDashboardService,$state,$rootScope,NetworkCallService,$timeout) {
    	
    	$rootScope.currentParent=$state.current.name;
    	sessionStorage.setItem('currentPage',$state.current.name);
    	$(window).off('resize');
    	$.loader_show();
		function resize(){
			if($state.current.name == "coverage.analyticDashboard"){
				if($rootScope.isOpen){
    	    		var newWidth=$(window).width()-200;
    	    		document.getElementById('mainView').style.width=newWidth+'px';
    	    		document.getElementById("mainView").style.height = $( window ).height()-64+"px";
    	    		document.getElementById("mainDiv").style.height = $( window ).height()-64+"px";
    	    		}else{
            		var newWidth=$(window).width()-50;
            		document.getElementById('mainView').style.width=newWidth+'px';
            		document.getElementById("mainView").style.height = $( window ).height()-64+"px";
    	    		document.getElementById("mainDiv").style.height = $( window ).height()-64+"px";
            	}
		}
		}
    	$(window).on('resize',function() {
    		setTimeout(function(){resize()},300);
		});
    	$rootScope.$watch('isOpen', function() {
    		resize();
    		});
    	setTimeout(function(){resize()},300);
		$scope.serviceCall=function(){
    	if(sessionStorage.getItem('oveerallData')){
			var data=JSON.parse(sessionStorage.getItem('oveerallData')).body;
			$scope.mainData=data;
			$timeout(function(){
					overallFunction(data);
					$.loader_hide();
				},100);
			$.loader_hide();
		}
		else{
			var token=sessionStorage.getItem('token');
			coverageDashboardService.getFuelLevelData(token).then(function(data){
				if(data.body.data != undefined){
				if(data.body.data.error.refreshToken == true){
                    var refreshToken=sessionStorage.getItem('refreshToken');
                    NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
                    	sessionStorage.setItem('token',responceData.accessToken);
                          $scope.serviceCall();
                          return;
                    },function(error){
                         alert('Unable to connect to the Services!');
                    });
              }
				}
              else{
            	sessionStorage.setItem('oveerallData',JSON.stringify(data));
  				data=data.body;
  				$scope.mainData=data;
  				console.log(data);
  				$timeout(function(){
  					overallFunction(data);
  					$.loader_hide();
  				},100);
  				 
              }
               
                },function(error){
                	alert('Unable to connect to the Services!');
                      $.loader_hide();
                });
		}
		}
		$scope.serviceCall();
    	function overallFunction(data){
			var color="#C6C4C3,#01BFF3";
           	$scope.minHealth=data[0].overallcount;
          // 	$("#gas").attr("data-percent",$scope.minHealth);
    		$("#gas").attr("data-color",color);
    		$("#gas").loading();
           	$scope.steamHealth='65';
           	$("#steam").attr("data-percent",$scope.steamHealth);
    		$("#steam").attr("data-color",color);
    		$("#steam").loading();
    		$scope.nuclearHealth='63';
           	$("#nuclear").attr("data-percent",$scope.nuclearHealth);
    		$("#nuclear").attr("data-color",color);
    		$("#nuclear").loading();
    		$.loader_hide();
		}
    	$scope.systemLevel=function(selectedFuel){
		$state.go('coverage.analyticCount', {
				fuelSelected:selectedFuel
            });
		}
    	$scope.coverageHome=function(){
    		$state.go('home');
    		}
    }]);
})();