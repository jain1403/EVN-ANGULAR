(function() {
	  'use strict';

	  var myApp=angular.module("myApp");

	  myApp.directive('tooltip', function () {
	      return {
	          restrict:'A',
	          link: function(scope, element, attrs)
	          {
	              $(element)
	                  .attr('title',scope.$eval(attrs.tooltip))
	                  .tooltip({placement: "right",
	                	  container: 'body'
	                		  });
	          }
	      }
	  })
	  
myApp.directive('popover', function () {
    return {
        restrict:'A',
        scope: { item: '=popover' },
        link: function(scope, element, attrs)
        {
            scope.$watch('item', function(item) {
                
                $(element).popover({ 
                    title: item.name,
                    content: item.tooltip
                });
                
                item.newProp = "done " + item.name;
            });
        }
    }
})
    myApp.controller('CoverageController',['$scope','coverageDashboardService','$state','$rootScope', function ($scope,coverageDashboardService,$state,$rootScope) {
	  var offset=$rootScope.isOpen?230:50;
	  $rootScope.viewStyle={'width':($(window).width()-offset)+'px',height:($(window).height()-64)+'px'};
	  $scope.toggleSideMenu = function(){
		  $rootScope.isOpen = !$rootScope.isOpen;
		 // var offset=$rootScope.isOpen?230:50;
		 // $rootScope.viewStyle={'width':($(window).width()-offset)+'px',height:($(window).height()-64)+'px'};
		  if($rootScope.isOpen){

			  $('.item').tooltip('disable');
			$.each($scope.menuItems,function(i,val){
			  $.each(val.subMenu,function(_i,res){
				  if(res.itemId===$state.current.name){
					  $scope.currentChild=$state.current.name;
					  $rootScope.currentParent=undefined;
					  $scope.expandParent=val.itemId;
					  $scope.historyFlag=true;
				  }
			  })
		  })
		  }
		  else{

			  $('.item').tooltip('enable');

			  $.each($scope.menuItems,function(i,val){
					if(val.subMenu){
						$scope.menuItems[i].subMenu[0]['isExpand']=undefined;
					}
				});
			  $scope.currentChild='';
			   $scope.expandParent='';
		  }
	  };
	  $scope.menuItems=[
	                    {
	              		  label:"Analytics Dashboard",
	              		  itemId:'coverage.analyticDashboard',
	              		  icon:'fa fa-area-chart',
	              		  tooltip: "Analytics Dashboard"
	              	  },
	              	  {
	              		  label:"Analytics Pipeline",
	              		  itemId:'coverage.analyticPipeLine',
	              		  icon:'fa-table',
	              		  tooltip: "Analytics Pipeline"
	              		  
	              	  },
	              	  {
	              		  label:"Reports/Lists",
	              		  itemId:'coverage.reportLists',
	              		  icon:'fa-file-text',
	              		  tooltip: "Reports/Lists"
	              		  
	              	  },
	              	  {
	              		  label:"Add Analytics",
	              		  itemId:'subMenu1',
	              		  icon:'fa-plus-square',
	              		  tooltip: "Add Analytics",
	              		  subMenu:[
	                               {
	                         		  label:"To APM",
	                         		  itemId:'coverage.toApm',
	                         		  icon:'fa fa-area-chart'
	                         	  },
	                         	  {
	                         		  label:"To Pipeline",
	                         		  itemId:'coverage.toPipeline',
	                         		  icon:'fa-table'
	                         		  
	                         	  }
	                         	  ]
	              		  
	              	  },
	              	  /*{
	              		  label:"Analyze Coverage",
	              		  itemId:'coverage.analyzeCoverage',
	              		  icon:'fa-file-text',
	              		  tooltip: "Analyze Coverage"
	              		  
	              	  },*/
	              	  {
	              		  label:"Customer Coverage",
	              		  itemId:'coverage.newlogic',
	              		  icon:'fa-file-text',
	              		  tooltip: "Customer Coverage"
	              		  
	              	  },
	              	  {
	              		  label:"Reference Documents",
	              		  itemId:'subMenu2',
	              		  icon:'fa-list-ul',
	              		  tooltip: "Reference Documents",
	              		  subMenu:[
	                               {
	                         		  label:"NERC Cause Codes",
	                         		  itemId:'coverage.nercCauseCode',
	                         		  icon:'fa fa-area-chart'
	                         	  },
	                         	  {
	                         		  label:"Failure Codes",
	                         		  itemId:'coverage.failureCode',
	                         		  icon:'fa-table'
	                         		  
	                         	  }
	                         	  ]
	              		  
	              	  }
	              	  ];
	
	  if(!(JSON.parse(sessionStorage.getItem('userDetails')).type == 'INTERNAL')){
	  $scope.menuItems = _.without($scope.menuItems, _.find($scope.menuItems, {
		  label: 'Add Analytics'
		}));
	  }
	  function loadHistory(){
		   var url=$state.current.name.split('.');
		  if(url[1]==='nercCauseCode' || url[1]==='failureCode' || url[1]==='toApm' || url[1]==='toPipeline'){
		  $rootScope.isOpen=true;
		  $.each($scope.menuItems,function(i,val){
			  $.each(val.subMenu,function(_i,res){
				  if(res.itemId===$state.current.name){
					  $scope.currentChild=$state.current.name;
					  $rootScope.currentParent=undefined;
					  $scope.expandParent=val.itemId;
					  $scope.historyFlag=true;
				  }
			  })
		  })
	  }
	};
	loadHistory();
		$scope.gotoState = function(item,child,evt){
			if(child){
				evt.stopPropagation();
				$scope.currentChild=item.itemId;
				$rootScope.currentParent=undefined;
				$state.go(item.itemId);
			}else{
				if(!$scope.historyFlag){
					$rootScope.currentParent=item.itemId;
					$scope.currentChild='';
					if(item.subMenu){
						$('.item').tooltip('disable');
						$rootScope.currentParent=undefined;
						var state=item.subMenu[0]['isExpand'];
						$.each($scope.menuItems,function(i,val){
							if(val.subMenu){
								$scope.menuItems[i].subMenu[0]['isExpand']=undefined;
							}
						});
						item.subMenu[0]['isExpand']=state;
						if(item.subMenu[0]['isExpand'])
							$scope.expandParent=undefined;
						else
							$scope.expandParent=item.itemId;
						
						item.subMenu[0]['isExpand']=!item.subMenu[0]['isExpand'];
						$rootScope.isOpen=true;
						$scope.currentChild=$state.current.name;
						
					}
					else{
						$.each($scope.menuItems,function(i,val){
							if(val.subMenu){
								val.subMenu[0]['isExpand']=undefined;
							}
						});
						$scope.expandParent=undefined;
						$state.go(item.itemId);
					}
				}else{
					$.each($scope.menuItems,function(i,val){
						if(val.subMenu){
							$scope.menuItems[i].subMenu[0]['isExpand']=undefined;
						}
					});
					$scope.expandParent=undefined;
					$scope.historyFlag=false;
				}
			}
			
		}  
		if($rootScope.isOpen){
			 setTimeout(function(){$('.item').tooltip('disable');},200);
		}
    }]);  
	})();