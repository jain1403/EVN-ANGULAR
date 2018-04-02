var analyticApp = angular.module('myApp');
analyticApp.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.changePassword.newPswd.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
                scope.confirmPassword=!noMatch;
            })
        }
    }
});
analyticApp.controller('ChangePasswordCtrl', ['$scope', '$rootScope', 'changePwdService','$state','NetworkCallService',
	function($scope, $rootScope, changePwdService, $state, NetworkCallService) {
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	$scope.userDetails={};
	$scope.userdata={};
	
	
	$scope.blurMethodPwd = function(){
		$scope.pwd=true;

	}
	$scope.nonBlurMethodpwd = function(){
		$scope.pwd=false;

	}
	$scope.blurMethodCnfrmPwd = function(){
		$scope.CnfrmPwd=true;

	}
	$scope.nonBlurMethodCnfrmPwd = function(){
		$scope.CnfrmPwd=false;

	}

	
	
	$scope.checkDetails = function(){
		return (!$scope.userDetails.oldpswd || !$scope.userDetails.newPswd || !$scope.confirmPassword);
	};
	$scope.savePassword=function(){
    	
		if(sessionStorage.getItem('userDetails') !=null){
			var userInfo=JSON.parse(sessionStorage.getItem('userDetails'));
			$scope.userdata.userName=userInfo.userId;
			$scope.userdata.oldPwd=Base64.encode($scope.userDetails.oldpswd);
			$scope.userdata.newPwd=Base64.encode($scope.userDetails.newPswd);
			
			var token=sessionStorage.getItem('token');
			changePwdService.changePwd($scope.userdata,token).then(function(data){
				if(data.body != undefined){
				if(data.body.data.error.refreshToken == true){
                    var refreshToken=sessionStorage.getItem('refreshToken');
                    NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
                    	sessionStorage.setItem('token',responceData.accessToken);
                          $scope.savePassword();
                          return;
                    },function(error){
                         alert('Unable to connect to the Services!');
                    });
              }
				}
              else{
            	  $.loader_hide();
            	  if(data.message == "Success"){
      				alert("Password Changed Successfully");
      				$state.go(sessionStorage.getItem('currentPage'));
      			}
      			else{
      				$scope.userDetails.oldpswd="";
      				$scope.userDetails.newPswd="";
      				$scope.userDetails.cnfrmNewPswd="";
      				alert("Old Password is incorrect");
      				$state.go("changePassword");
      				
      			}
  				
              }
               
                },function(error){
                	alert('Unable to connect to the Services!');
                      $.loader_hide();
                });
		}
		}
	$scope.changePasswordSubmit = function(){
		 $.loader_show();
		 $scope.savePassword();
	}
	$scope.abortChangePwd = function(){
		$state.go(sessionStorage.getItem('currentPage'));
	}
	
	}]);
  