var analyticApp = angular.module('myApp');
analyticApp.controller('appController', ['$scope', '$rootScope','$state',
	 function($scope, $rootScope, $state) {
	   $scope.dataSwitch=false;
	   $rootScope.filterBy='NERCCauseCode';
	   PNotify.prototype.options.styling = "bootstrap3";
	   $scope.logout = function(){
		   angular.forEach(sessionStorage, function (item,key) {
	  	          sessionStorage.removeItem(key);
	  	      	});
			  $rootScope.adminFlag=false;
			  $rootScope.userName="";
			  $rootScope.loggedInName=false;
			  window.location.href = '/logout';
		  };
		  $scope.changePassword = function(){  
			  $state.go('changePassword');
		  };
		  $scope.advancedSettings=function(){
			  $scope.settings=true;
		  }
		  $scope.refreshDashboard=function(){
			  	  if($scope.dataSwitch){
				  $rootScope.filterBy='FailureMode';
			  	  }
			  	  else{
			  		 $rootScope.filterBy='NERCCauseCode';  
			  	  }
			  	if($state.current.name == 'coverage.analyticCount')
			  		$state.reload();
			  	$scope.settings=false;
		  }
		  $scope.redirectToNewApp=function(){
			  
			//  window.open('http://ec2-52-25-199-162.us-west-2.compute.amazonaws.com:9001', '_blank', 'location=yes,height='+$( window ).height()+',width='+$(window).width()+',scrollbars=yes,status=yes')
			//  window.open('http://ec2-52-25-199-162.us-west-2.compute.amazonaws.com:9001')
			  window.open('http://3.209.34.53:9001')
		  }
}]);