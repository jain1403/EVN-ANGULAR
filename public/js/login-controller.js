var analyticApp = angular.module('myApp');
analyticApp.controller('loginCtrl', ['$scope', '$rootScope', 'NetworkCallService','$state',
	function($scope, $rootScope, NetworkCallService, $state) {
	$rootScope.current="";
	$scope.userDetails={};
	$.loader_show();
	if(sessionStorage.getItem('userDetails')){
		$.loader_hide();
		var userInfo=JSON.parse(sessionStorage.getItem('userDetails'));
		$rootScope.userName=userInfo.firstName + " " + userInfo.lastName;
		//$rootScope.loggedIn=true;
		sessionStorage.setItem('loggedIn',true);
		if(userInfo.isAdmin)
			$rootScope.adminFlag="true";
		$rootScope.adminType=userInfo.type;
		$rootScope.current=sessionStorage.getItem('currentPage');
		if($rootScope.current)
			$state.go($rootScope.current);
		else
			$state.go("catalog");
		}
		else{
			NetworkCallService.login().then(function(responceData){
				$.loader_hide();
				$rootScope.userName=responceData.firstName + " " + responceData.lastName;
				$scope.userDetails={
						"firstName":responceData.firstName,
						"lastName":responceData.lastName,
						"isAdmin":responceData.isAdmin,
						"type":responceData.type,
						"userId":responceData.username
				};
				$rootScope.loggedInName=true;
				sessionStorage.setItem('userDetails',JSON.stringify($scope.userDetails));
				sessionStorage.setItem('SSO',responceData.username);
				sessionStorage.setItem('token',responceData.token);
				sessionStorage.setItem('refreshToken',responceData.refreshToken);
				sessionStorage.setItem('currentPage',"catalog");
				sessionStorage.setItem('loggedIn',true);
				//$rootScope.loggedIn=true;
				$state.go("catalog");
				//if(responceData.isAdmin)
					$rootScope.adminFlag=responceData.isAdmin;
					$rootScope.adminType=responceData.type;
			},function(error){
				$.loader_hide();
				if(error.data){
					$scope.error=true;
					alert(error.data.error);
				}
				else{
					$scope.userDetails.psw="";
					alert("Something went wrong...!\n Please check your connection and try again.");
				}
			});
	}
	
		
	
}]);
  