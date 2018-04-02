(function() {
	'use strict';
	var app=angular.module("myApp");
	app.controller('failureCodeCtrl',['$scope','referenceDocumentsService','$state','uiGridConstants','uiGridGroupingConstants','$filter','$timeout','$rootScope','NetworkCallService', function ($scope,referenceDocumentsService,$state,uiGridConstants,uiGridGroupingConstants,$filter,$timeout,$rootScope,NetworkCallService) {	
		$rootScope.currentParent=$state.current.name;
		sessionStorage.setItem('currentPage',$state.current.name);
		$.loader_show();
		$scope.gridHeight= $(window).height()-140;
		function resize(){
			var offset=$rootScope.isOpen?230:50;
			var offHeight=$(window).width();
			document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
			document.getElementById('mainView').style.height=($(window).height()-64)+'px';	
			setTimeout(function(){
			angular.element(document.getElementsByClassName('grid1')[0]).css('height', ($(window).height()-120) + 'px');
			angular.element(document.getElementsByClassName('grid1')[0]).css('width', ($(window).width()-offset-20) + 'px');
	    		},200)
			}
	
		$(window).off('resize');
		$(window).on('resize',function() {
			if($state.current.name == 'coverage.failureCode')
			resize();
		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.failureCode')
			resize();
		});

		$scope.referenceDataCall=function(){
			if(sessionStorage.getItem('referenceDocumentsData')){
				var data=JSON.parse(sessionStorage.getItem('referenceDocumentsData')).body;
				$scope.myData = data.nercCodeData;
				$scope.mainData=$scope.myData;
				setTimeout(function(){
					$('.ui-grid-viewport').addClass('scroll-bar');
				},200);
				$.loader_hide();
			}
			else{
				var token=sessionStorage.getItem('token');
				referenceDocumentsService.referenceDataCall(token).then(function(data){
					if(data.body.data != undefined){
						if(data.body.data.error.refreshToken == true){
							var refreshToken=sessionStorage.getItem('refreshToken');
							NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
								sessionStorage.setItem('token',responceData.accessToken);
								$scope.referenceDataCall();
								return;
							},function(error){
								alert('Unable to connect to the Services!');
							});
						}
					}
					else{
						sessionStorage.setItem('referenceDocumentsData',JSON.stringify(data));
						$scope.myData = data.body.nercCodeData;
						$scope.mainData=$scope.myData;
						$('.ui-grid-viewport').addClass('scroll-bar');
						$.loader_hide();
					}
				},function(error){
					alert('Unable to connect to the Services!');
					$.loader_hide();
				});
			}
		}
		$scope.referenceDataCall();

		$scope.failureCode = {
				exporterMenuCsv: true,
				enableGridMenu: true,
				enableFiltering: true,
				exporterMenuPdf: false,
				treeRowHeaderAlwaysVisible: true,
				exporterCsvFilename: 'Failure_Code.csv',
				exporterMenuVisibleData:false,
				/*enableColumnResizing: true,*/
				data:'myData',
				columnDefs : [
				              { name:'failureId',displayName: 'GADS Code',cellTooltip: true},
				              { name:'failureName',displayName: 'Description',cellTooltip: true}
				              ],
				              enableCellEditOnFocus : false  
		};
		$scope.refreshData = function() {
			$scope.myData=$filter('filter')($scope.mainData, $scope.searchText);
			$scope.failureCode.data = 'myData';
		};
	}]);  
})();