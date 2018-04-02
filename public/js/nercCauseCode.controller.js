
(function() {
	'use strict';
	var app=angular.module("myApp");
	app.controller('nercCauseCodeCtrl',['$scope','referenceDocumentsService','$state','uiGridConstants','uiGridGroupingConstants','$filter','$timeout','$rootScope','NetworkCallService', function ($scope,referenceDocumentsService,$state,uiGridConstants,uiGridGroupingConstants,$filter,$timeout,$rootScope,NetworkCallService) {
		$(window).off('resize');
		$rootScope.currentParent='';
		$rootScope.currentParent=$state.current.name;
		sessionStorage.setItem('currentPage',$state.current.name);
		$.loader_show();
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
		$(window).on('resize',function() {
			if($state.current.name == 'coverage.nercCauseCode')
			resize();
		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.nercCauseCode')
			resize();
		});
		$scope.referenceDataCall=function(){
			if(sessionStorage.getItem('referenceDocumentsData')){
				var data=JSON.parse(sessionStorage.getItem('referenceDocumentsData')).body;
				$scope.myData = data.causeCodeDetails;
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
						$scope.myData = data.body.causeCodeDetails;
						$scope.mainData=$scope.myData;
						resize();
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
		$scope.nercCauseCode = {
				exporterMenuCsv: true,
				enableGridMenu: true,
				enableFiltering: true,
				exporterMenuPdf: false,
				treeRowHeaderAlwaysVisible: true,
				exporterCsvFilename: 'Nerc_Cause_Code.csv',
				exporterMenuVisibleData:false,
				enableColumnResizing: true,
				data:'myData',
				onRegisterApi: function (gridApi) {
					gridApi.core.on.rowsVisibleChanged($scope, function (row) {
						setTimeout(function(){
							if($(".ui-grid-canvas").height()+80 >= $(window).height()-120){
								angular.element(document.getElementsByClassName('grid1')[0]).css('height', $(window).height()-120 + 'px');	
							}else{
								angular.element(document.getElementsByClassName('grid1')[0]).css('height', $(".ui-grid-canvas").height()+80 + 'px');	
							}
						},200);
					});
									
				} ,
				columnDefs : [
				              { name:'assetName',cellTooltip: true,groupingShowAggregationMenu: false,grouping: { groupPriority: 0 }},
				              { name:'systemName',cellTooltip: true,groupingShowAggregationMenu: false, grouping: { groupPriority: 1 }},
				              { name:'subSystemName',displayName: 'Sub-system Name',cellTooltip: true,groupingShowAggregationMenu: false, grouping: { groupPriority: 2 }},
				              { name:'CompName',displayName: 'Component Name',cellTooltip: true,groupingShowAggregationMenu: false },
				              { name:'NERC_CAUSE_CODE',displayName: 'NERC Cause Code',cellTooltip: true,groupingShowAggregationMenu: false },
				              { name:'NERC_CAUSE_CODE_RANGES',displayName: 'NERC Cause Code Ranges ', visible: false,cellTooltip: true,groupingShowAggregationMenu: false }
				              ],
				              enableCellEditOnFocus : false  
		};
		$scope.refreshData = function() {
			$scope.myData=$filter('filter')($scope.mainData, $scope.searchText);
			$scope.nercCauseCode.data = 'myData';
		};
	}]);
})();