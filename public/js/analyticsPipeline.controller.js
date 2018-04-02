
(function() {
	'use strict';

	var app=angular.module("myApp");
	app.controller('analyticsPipelineCtrl',['$scope','analyticsPipelineService','$state','NgTableParams','uiGridConstants','$filter','$timeout','$rootScope','dataStorage','$stateParams','NetworkCallService', function ($scope,analyticsPipelineService,$state,NgTableParams,uiGridConstants,$filter,$timeout,$rootScope,dataStorage,$stateParams,NetworkCallService) {
		$.loader_show();
		if($stateParams.fuel_name != "")
			{
			$scope.backButton=true;
			}
		else{
			$scope.backButton=false;
		}
		$rootScope.currentParent=$state.current.name;
		sessionStorage.setItem('currentPage',$state.current.name);
		$scope.gridHeight= $(window).height()-140;
		
		
		function resize(){
			var offset=$rootScope.isOpen?230:50;
			document.getElementById('mainView').style.width=($(window).width()-offset-10)+'px';
			document.getElementById('mainView').style.height=($(window).height()-64)+'px';
			var offHeight=$(window).height();
			setTimeout(function(){
				if($scope.filterSelected){
				angular.element(document.getElementsByClassName('grid1')[0]).css('height', $(".ui-grid-canvas").height()+80 + 'px');
				}
				else{
				angular.element(document.getElementsByClassName('grid1')[0]).css('height', $(".ui-grid-canvas").height()+80 + 'px');
				}
			angular.element(document.getElementsByClassName('grid1')[0]).css('width', ($(window).width()-offset-20) + 'px');
			},200);
		}
		$(window).off('resize');
		$(window).on('resize',function() {
			if($state.current.name == 'coverage.analyticPipeLine')
				setTimeout(function(){resize();},200);
		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.analyticPipeLine')
				setTimeout(function(){resize();},200);
		});

		$scope.serviceCall=function(){
			if(sessionStorage.getItem('pipelineData')){
				var data=JSON.parse(sessionStorage.getItem('pipelineData')).body;
				$scope.myData = data;
				if($stateParams.label == "Failure Mode With Analytics In Pipeline"){
					$scope.filterSelected=true;
					$scope.filterFuelName=$stateParams.fuel_name;
					$scope.filterassetName=$stateParams.assetName;
					$scope.myData=_.filter($scope.myData, function(item){ 
						return item.assetName == $stateParams.assetName && item.fuelName == $stateParams.fuel_name;})
				}
				$scope.mainData=$scope.myData;
				$scope.totalCount=$scope.mainData.length;
				setTimeout(function(){
					$('.ui-grid-viewport').addClass('scroll-bar');
				},200);
				$.loader_hide();
			}
			else{
				var token=sessionStorage.getItem('token');
				analyticsPipelineService.analyticServiceCall(token).then(function(data){
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
						sessionStorage.setItem('pipelineData',JSON.stringify(data));
						$scope.myData = data.body;
						if($stateParams.label == "Failure Mode With Analytics In Pipeline"){
							$scope.filterSelected=true;
							$scope.filterFuelName=$stateParams.fuel_name;
							$scope.filterassetName=$stateParams.assetName;
							$scope.myData=_.filter($scope.myData, function(item){ 
								return item.assetName == $stateParams.assetName && item.fuelName == $stateParams.fuel_name;})
						}
						$scope.mainData=$scope.myData;
						$scope.totalCount=$scope.mainData.length;
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
		$scope.serviceCall();
		$scope.columns= [
		                 { name:'fuelName',displayName: 'Fuel Name',width:'20%',cellTooltip: true },
		                 { name:'analyticName',displayName: 'Analytic Name',width:'20%',cellTooltip: true },
		                 { name:'analyticDesc',displayName: 'Analytic Description',width:'20%',cellTooltip: true },
		                 { name:'analyticSource',displayName: 'Analytic Source',width:'20%',cellTooltip: true, visible: false },
		                 { name:'assetName',displayName: 'Asset Name',width:'20%',cellTooltip: true, visible: false },
		                 { name:'systemName',displayName: 'System Name',width:'20%',cellTooltip: true},
		                 { name:'subSystemName',displayName: 'Sub-System Name',width:'20%',cellTooltip: true, visible: false },
		                 { name:'CompName',displayName: 'Component Name',width:'20%',cellTooltip: true , visible: false},
		                 { name:'nercCauseCode',displayName: 'NERC Cause Code',width:'20%',cellTooltip: true, visible: false },
		                 { name:'nercFuelCode',displayName: 'NERC Fuel Code',width:'20%',cellTooltip: true, visible: false },
		                 { name:'applicationName',displayName: 'Application Name',width:'20%',cellTooltip: true, visible: false },
		                 { name:'applicationType',displayName: 'Application Type',width:'20%',cellTooltip: true },
		                 { name:'applicationMake',displayName: 'Application Make',width:'20%',cellTooltip: true, visible: false }
		                 ];
		$scope.columnVisibility=false;
		$scope.gridOptions = {
				exporterMenuCsv: true,
				enableGridMenu: true,
				enableFiltering: true,
				exporterMenuPdf: false,
				exporterCsvFilename: 'Analytics-Pipline.csv',
				data:'myData',
				columnDefs : $scope.columns,
				enableCellEditOnFocus:false,
				enableColumnResizing: true,
				gridMenuCustomItems: [{
					title: 'Show All Columns',
					action: function($event) {
						$scope.columnVisibility = !$scope.columnVisibility;
						$scope.btnText = $scope.columnVisibility ? "Hide All Columns" : "Show All Columns";
						for (var j = 0; j < $scope.columns.length; j++){
							$scope.columns[j].visible = $scope.columnVisibility;
						}
						$scope.columns=JSON.parse(JSON.stringify($scope.columns));
						$scope.gridOptions.columnDefs=$scope.columns;
						$scope.gridOptions.gridMenuCustomItems[0].title=$scope.btnText;
					},
					order: 300
				}],
				onRegisterApi: function (api) {
					    $scope.gridApi = api;
					  }
		};
		setTimeout(function(){
			$scope.gridApi.core.on.filterChanged( $scope, function() {
				setTimeout(function(){   
					$scope.totalCount=$scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length;
					$scope.$apply();
				},200);
		       });
		},200);
		$scope.refreshCount = function() {
			var data=JSON.parse(sessionStorage.getItem('pipelineData')).body;
			$scope.myData = data;
			$scope.totalCount=$scope.myData.length;
			$scope.gridOptions.data = 'myData';
			$scope.filterSelected=false;
			$scope.gridApi.grid.clearAllFilters();
			//$scope.$apply();
		}; 
		$scope.isfilterclear = true;
		setTimeout(function(){
		$scope.gridApi.core.on.filterChanged( $scope, function() {

            var grid = this.grid;

            // Define behavior for cancel filtering
            $scope.isfilterclear = true;

            angular.forEach(grid.columns, function( col ) {
                if(col.filters[0].term){
               	 $scope.isfilterclear = false;
                }
            });
            
           
		 });
		},200);
		$scope.clearFuel = function() {
			$scope.fuelSelected=true;
			$scope.assetSelected=true;
			if($scope.assetSelected==false || $scope.assetSelected==undefined){
			$scope.myData=$filter('filter')(JSON.parse(sessionStorage.getItem('pipelineData')).body, $scope.filterassetName);
			}
			else{$scope.myData=JSON.parse(sessionStorage.getItem('pipelineData')).body;}
			$scope.gridOptions.data = 'myData';
			if($scope.isfilterclear)
			$scope.totalCount=$scope.myData.length;
			console.log($scope.isfilterclear);
			if($scope.fuelSelected==true && $scope.assetSelected==true)
			$scope.filterSelected=false;	
			//$scope.$apply();
		};
		$scope.clearFilter = function() {
			$scope.myData=JSON.parse(sessionStorage.getItem('pipelineData')).body;
			$scope.gridOptions.data = 'myData';
			$scope.filterSelected=false;
		}
		$scope.clearAsset = function() {
			$scope.assetSelected=true;
			if($scope.fuelSelected==false || $scope.fuelSelected==undefined){
			$scope.myData=$filter('filter')(JSON.parse(sessionStorage.getItem('pipelineData')).body, $scope.filterFuelName);
			}
			else{$scope.myData=JSON.parse(sessionStorage.getItem('pipelineData')).body;}
			$scope.gridOptions.data = 'myData';
			if($scope.isfilterclear)
			$scope.totalCount=$scope.myData.length;
			console.log($scope.isfilterclear);
			if($scope.fuelSelected==true && $scope.assetSelected==true)
				$scope.filterSelected=false;	
			//$scope.$apply();
		};
		$scope.refreshData = function() {
			$scope.myData=$filter('filter')($scope.mainData, $scope.searchText);
			$scope.gridOptions.data = 'myData';
		};
		$scope.backToMainfrmPipeline=function(){
			$state.go('coverage.analyticCount', {
				previosState:"pipeLine"
            });
			
		}
	}]);
})();