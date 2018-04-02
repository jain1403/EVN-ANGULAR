(function() {
	'use strict';

	var app=angular.module("myApp");
	app.controller('reportListsCtrl',['$scope','reportListsService','$state','uiGridConstants','uiGridGroupingConstants','$filter','$timeout','$rootScope','$stateParams','NetworkCallService', function ($scope,reportListsService,$state,uiGridConstants,uiGridGroupingConstants,$filter,$timeout,$rootScope,$stateParams,NetworkCallService) {	

		$rootScope.currentParent=$state.current.name;
		sessionStorage.setItem('currentPage',$state.current.name);
		$.loader_show();
		if($stateParams.fuel_name != "")
		{
		$scope.backButton=true;
		}
	else{
		$scope.backButton=false;
	}
		$scope.gridHeight= $(window).height()-140;
		$scope.columnVisibility=false;
		$(window).off('resize');
		function resize(){
			var offset=$rootScope.isOpen?230:50;
			document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
	    	document.getElementById('mainView').style.height=($(window).height()-64)+'px';
	    	var offHeight=$(window).height();
	    	setTimeout(function(){
    		if($scope.filterSelectedReport){
				angular.element(document.getElementsByClassName('grid1')[0]).css('height', offHeight-160 + 'px');
				}
				else{
					angular.element(document.getElementsByClassName('grid1')[0]).css('height', offHeight-120 + 'px');	
				}
			angular.element(document.getElementsByClassName('grid1')[0]).css('width', ($(window).width()-offset-20) + 'px');
	    	},200);
		
			}
		$(window).on('resize',function() {
			if($state.current.name == 'coverage.reportLists')
			resize();

		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.reportLists')
			resize();
		});

		$scope.serviceCall=function(){
			if(sessionStorage.getItem('reportData')){
				var data=JSON.parse(sessionStorage.getItem('reportData')).body;
				$scope.myData = data;
				if($stateParams.assetName != ""){
					$scope.filterSelectedReport=true;
					$scope.filterFuelNameReport=$stateParams.fuel_name;
					$scope.filterassetNameReport=$stateParams.assetName;
					if($stateParams.analyticMapping == "Analytic Coverage")
					{
						$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name === $stateParams.assetName && item.coverageFlag === "1" && (item.analytic_coverage === "High" || item.analytic_coverage === "Medium");})
					}
					if($stateParams.analyticMapping == "No Analytic Coverage")
					{
						$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name === $stateParams.assetName && item.coverageFlag === "1" && item.analytic_coverage === "Limited/No";})
					}
					if($stateParams.label == "Failure Mode With Analytics Available"){
						$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name == $stateParams.assetName && item.fuel_name == $stateParams.fuel_name;})
					}
					if($stateParams.label == "Failure Mode Without Analytics"){
						$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name == $stateParams.assetName && item.fuel_name == $stateParams.fuel_name;})		
					}
				}
				$scope.mainData=$scope.myData;
				setTimeout(function(){
				$('.ui-grid-viewport').addClass('scroll-bar');
				},200);

				$.loader_hide();
			}
			else{
				var token=sessionStorage.getItem('token');
				reportListsService.reportListsCall(token).then(function(data){
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
						sessionStorage.setItem('reportData',JSON.stringify(data));
						$scope.myData = data.body;
						if($stateParams.assetName != ""){
							$scope.filterSelectedReport=true;
							$scope.filterFuelNameReport=$stateParams.fuel_name;
							$scope.filterassetNameReport=$stateParams.assetName;
							if($stateParams.analyticMapping == "Analytic Coverage")
							{
								$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name === $stateParams.assetName && item.coverageFlag === "1" && (item.analytic_coverage === "High" || item.analytic_coverage === "Medium");})
							}
							if($stateParams.analyticMapping == "No Analytic Coverage")
							{
								$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name === $stateParams.assetName && item.coverageFlag === "1" && item.analytic_coverage === "Limited/No";})
							}
							if($stateParams.label == "Failure Mode With Analytics Available"){
								$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name == $stateParams.assetName && item.fuel_name == $stateParams.fuel_name;})
							}
							if($stateParams.label == "Failure Mode Without Analytics"){
								$scope.myData=_.filter($scope.myData, function(item){ return item.asset_name == $stateParams.assetName && item.fuel_name == $stateParams.fuel_name;})		
							}
						}
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
		$scope.serviceCall();
		$scope.columns= [
		                 { name:'analyticName',displayName: 'Analytics Name',cellTooltip: true,width:'20%',width:'20%'},
		                 { name:'analyticDesc',displayName: 'Analytics Description',cellTooltip: true,width:'20%'},
		                 { name:'analyticSource',displayName: 'Analytics Source',cellTooltip: true,width:'20%'},
		                 { name:'nerc_cause_code',displayName: 'NERC Cause Code',cellTooltip: true,width:'20%'},
		                 { name:'failurename',displayName: 'Failure Name',cellTooltip: true,width:'20%'},
		                 { name:'bluePrintName',displayName: 'Blueprint Name',cellTooltip: true,width:'20%',width:'20%', visible: false},
		                 { name:'component_name',displayName: 'Component Name',cellTooltip: true,width:'20%', visible: false},
		                 { name:'awsMigrationStatus',displayName: 'AWS Migration Status',cellTooltip: true,width:'20%', visible: false},
		                 { name:'tagname',displayName: 'Tag Name',cellTooltip: true,width:'20%', visible: false},
		                 { name:'model_blueprint',displayName: 'Blueprint Model',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analyticTechniques',displayName: ' Analytic Technique(s)',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analyticPlatform',displayName: 'Analytic Platform',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analytic_developer',displayName: 'Analytic Developer',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analyticOwner',displayName: 'Analytic Owner',cellTooltip: true,width:'20%', visible: false},
		                 { name:'stakeholders',displayName: 'Stake Holders',cellTooltip: true,width:'20%', visible: false},
		                 { name:'AanalyticsNameCatlg',displayName: 'Analytics Catalog Name',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analyticReadiness',displayName: 'Analytic Readiness',cellTooltip: true,width:'20%', visible: false},
		                 { name:'predixReadiness',displayName: 'Predix Readiness',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analyticDocumentLink',displayName: 'Documentation Link',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analytic_marketing_document_link',displayName: 'Analytic Marketing Document Link',cellTooltip: true,width:'20%', visible: false},
		                 { name:'fuel_name',displayName: 'Fuel',cellTooltip: true,width:'20%', visible: false},
		                 { name:'nerc_failure_code',displayName: 'NERC Failure Code',cellTooltip: true,width:'20%', visible: false},
		                 { name:'analytic_coverage',displayName: 'Analytic Coverage',cellTooltip: true,width:'20%', visible: false},
		                 { name:'coverageFlag',displayName: 'Coverage Flag',cellTooltip: true,width:'20%', visible: false},
		                 { name:'nerc_cause_code_range',displayName: 'NERC Cause Code Range',cellTooltip: true,width:'20%', visible: false},
		                 { name:'forced_outages_uy',displayName: 'Forced Outages UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'forced_outages_mwh_uy',displayName: 'Forced Outages MWH UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'forced_outages_hrs_uy',displayName: 'Forced Outages HRS UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'forced_derates_uy',displayName: 'Forced Derates UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'forced_derates_mwh_uy',displayName: 'Forced Derates MWH UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'forced_derates_hrs_uy',displayName: 'Forced Derates HRS UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'schd_forc_outgs_n_drs_uy',displayName: 'Schd Force Outages & DRS UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'schd_forc_outgs_n_drs_mwh_uy',displayName: 'Schd Force Outages & DRS MWH UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'schd_forc_outgs_n_drs_hrs_uy',displayName: 'Schd Force Outages & DRS HRS UY',cellTooltip: true,width:'20%', visible: false},
		                 { name:'applicationname',displayName: 'Application Name',cellTooltip: true,width:'20%', visible: false},
		                 { name:'fuel_code',displayName: 'Fuel Code',cellTooltip: true,width:'20%', visible: false},
		                 { name:'asset_name',displayName: 'Asset Name',cellTooltip: true,width:'20%', visible: false},
		                 { name:'system_name',displayName: 'System Name',cellTooltip: true,width:'20%', visible: false},
		                 { name:'sys_nerc_cause_code_range',displayName: 'System NERC Cause Code Range',cellTooltip: true,width:'20%', visible: false},
		                 { name:'subsystem_name',displayName: 'Sub-system Name',cellTooltip: true,width:'20%', visible: false}

		                 ];
		$scope.reportLists = {
				exporterMenuCsv: true,
				enableGridMenu: true,
				enableFiltering: true,
				exporterMenuPdf: false,
				treeRowHeaderAlwaysVisible: true,
				exporterCsvFilename: 'Reports&Lists.csv',
				exporterMenuVisibleData:false,
				data:'myData',
				columnDefs :$scope.columns,
				enableCellEditOnFocus : false,
				/*enableColumnResizing: true,*/
				gridMenuCustomItems: [{
					title: 'Show All Columns',
					action: function($event) {

						$scope.columnVisibility = !$scope.columnVisibility;

						$scope.btnText = $scope.columnVisibility ? "Hide All Columns" : "Show All Columns";
						for (var j = 0; j < $scope.columns.length; j++){
							$scope.columns[j].visible = $scope.columnVisibility;
						}
						$scope.columns=JSON.parse(JSON.stringify($scope.columns));
						$scope.reportLists.columnDefs=$scope.columns;
						$scope.reportLists.gridMenuCustomItems[0].title=$scope.btnText;
					},
					order: 300
				}]
		};
		$scope.refreshData = function() {
			$scope.myData=$filter('filter')($scope.mainData, $scope.searchText);
			$scope.reportLists.data = 'myData';
		};
		$scope.backToMainfrmReport=function(){
			$state.go('coverage.analyticCount', {
				previosState:"reports"
            });
		}
		$scope.clearFuelReport = function() {
			$scope.fuelSelectedReport=true;
			$scope.assetSelectedReport=true;
			if($scope.assetSelectedReport==false || $scope.assetSelectedReport==undefined){
			$scope.myData=$filter('filter')(JSON.parse(sessionStorage.getItem('reportData')).body, $scope.filterassetNameReport);
			}
			else{$scope.myData=JSON.parse(sessionStorage.getItem('reportData')).body;}
			$scope.reportLists.data = 'myData';
			//if($scope.isfilterclear)
			//$scope.totalCount=$scope.myData.length;
			//console.log($scope.isfilterclear);
			if($scope.fuelSelectedReport==true && $scope.assetSelectedReport==true)
			$scope.filterSelectedReport=false;	
			//$scope.$apply();
		};
		$scope.clearFilterReport = function() {
			$scope.myData=JSON.parse(sessionStorage.getItem('reportData')).body;
			$scope.reportLists.data = 'myData';
			$scope.filterSelectedReport=false;
		}
		$scope.clearAssetReport = function() {
			$scope.assetSelectedReport=true;
			if($scope.fuelSelectedReport==false || $scope.fuelSelectedReport==undefined){
			$scope.myData=$filter('filter')(JSON.parse(sessionStorage.getItem('reportData')).body, $scope.filterFuelNameReport);
			}
			else{$scope.myData=JSON.parse(sessionStorage.getItem('reportData')).body;}
			$scope.reportLists.data = 'myData';
			//if($scope.isfilterclear)
		//	$scope.totalCount=$scope.myData.length;
		//	console.log($scope.isfilterclear);
			if($scope.fuelSelectedReport==true && $scope.assetSelectedReport==true)
				$scope.filterSelectedReport=false;	
			//$scope.$apply();
		};
	}]);  
})();