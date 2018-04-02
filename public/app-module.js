(function() {
  'use strict';
   angular.module('myApp', ['ngAnimate','ngTouch','ngSanitize','ui.grid','ui.grid.treeView','ui.bootstrap','ui.grid.selection','ui.grid.resizeColumns','ui.grid.moveColumns', 'ui.grid.exporter','ui.router','angular.filter','ui.grid.autoResize','ui.grid.grouping','ui.grid.pinning','ui.ace','ngTable','angularjs-dropdown-multiselect','tooltips'])

  .config(function($stateProvider,$urlRouterProvider,$qProvider) {
	  $qProvider.errorOnUnhandledRejections(false);
	  $urlRouterProvider.when("", "login");
	
	    $stateProvider
		    .state('secure', {
		        template: '<ui-view/>',
		        abstract: true,
		        resolve: {
		        	"check":function($state,$rootScope){
		    			if(!sessionStorage.getItem('loggedIn')){
		    				$state.go('login');
		    				return;
		    			}
		    			else{
		    				if(sessionStorage.getItem('userDetails') !=null){
		    				var userInfo=JSON.parse(sessionStorage.getItem('userDetails'));
		    				$rootScope.userName=userInfo.firstName + " " + userInfo.lastName;
		    				if(userInfo.isAdmin)
		    					$rootScope.adminFlag="true";
		    				$rootScope.adminType=userInfo.type;
		    				}
		    			}
		    		}
		        }
		    })
		     .state('user', {
		        template: '<ui-view/>',
		        abstract: true,
		        resolve: {
		        	"check":function($state,$rootScope){
		        		 if(JSON.parse(sessionStorage.getItem('userDetails')).type == 'EXTERNAL'){
		        			 $state.go('home');
		    				return;
		    			}
		    		}
		        }
		    })
	    	.state('login', {
	    		url: "/login",
	    		controller: 'loginCtrl'
			})
			.state('home', {
				parent: 'secure',
	    		url: "/home",
	    		templateUrl: 'views/coverageHome.html',
	    		controller: 'coverageHomeCtrl'
			})
			.state('changePassword', {
				parent: 'secure',
	    		url: "/changePassword",
	    		templateUrl: 'views/changePassword.html',
	    		controller: 'ChangePasswordCtrl'
			})
	        .state("coverage", {
	        	parent: 'secure',
	        	url: "/coverage",
	        	templateUrl: "views/coverage.html",
	        	controller: 'CoverageController'
	        })
	        .state("coverage.analyticCount", {
	        	//parent: 'secure',
	            url: "/analyticCount",
	      	  		templateUrl: 'views/analyticCount.html',
	      	  		controller: 'analyticCountCtrl',
	      	  	params: {
                	fuelSelected:{},
                	previosState:''
                }
	        })
	         .state("coverage.newlogic", {
	        	//parent: 'secure',
	            url: "/newlogic",
	      	  		templateUrl: 'views/newlogic.html',
	      	  		controller: 'newlogicCtrl'
	        })
	         .state("coverage.analyticDashboard", {
	        	// parent: 'secure',
	            url: "/analyticDashboard",
	      	  		templateUrl: 'views/analyticsDashboard.html',
	      	  		controller: 'analyticDashboard'
	        })
	        .state("coverage.analyticPipeLine", {
	        	//parent: 'secure',
	            url: "/analyticPipeLine",
	      	  		templateUrl: 'views/analyticPipeLine.html',
	      	  		controller: 'analyticsPipelineCtrl',
	      	  	 params: {
	                	assetId:'',
	                    assetName: '',
	                    analyticMapping:'',
	                    label:'',
	                    fuel_name:''
	                }
	        })
	          .state("coverage.reportLists", {
	        	  //parent: 'secure',
	            url: "/reports&Lists",
	      	  		templateUrl: 'views/reportLists.html',
	      	  		controller: 'reportListsCtrl',
	      	  	 params: {
	                	assetId:'',
	                    assetName: '',
	                    analyticMapping:'',
	                    label:'',
	                    fuel_name:''
	                }
	        })
	            .state("coverage.analyzeCoverage", {
	            	//parent: 'secure',
	            url: "/analyzeCoverage",
	      	  		templateUrl: 'views/analyzeCoverage.html',
	      	  		controller: 'analyzeCoverageCtrl'
	        })
	        .state("coverage.nercCauseCode", {
	        	//parent: 'secure',
	            url: "/nercCauseCode",
	      	  		templateUrl: 'views/nercCauseCode.html',
	      	  		controller: 'nercCauseCodeCtrl'
	        })
	         .state("coverage.failureCode", {
	        	// parent: 'secure',
	            url: "/failureCode",
	      	  		templateUrl: 'views/failureCode.html',
	      	  		controller: 'failureCodeCtrl'
	        })
	          .state("coverage.add-update", {
	                url: "/add&update",
	      	  		templateUrl: 'views/add-update.html',
	      	  		controller: 'addUpdateCtrl'
	        })
	          .state("coverage.toApm", {
	        	  	url: "/toApm",
	      	  		templateUrl: 'views/toApm.html',
	      	  		controller: 'toApmCtrl' ,
	      	  		resolve: {
			        	"check":function($state,$rootScope){
			        		 if(JSON.parse(sessionStorage.getItem('userDetails')).type == 'EXTERNAL'){
			        			 $state.go('home');
			    				return;
			    			}
			    		}
			        }
	        })
	          .state("coverage.toPipeline", {
	        	  	url: "/toPipeline",
	      	  		templateUrl: 'views/toPipeline.html',
	      	  		controller: 'toPipelineCtrl',
		      	  	resolve: {
			        	"check":function($state,$rootScope){
			        		 if(JSON.parse(sessionStorage.getItem('userDetails')).type == 'EXTERNAL'){
			        			 $state.go('home');
			    				return;
			    			}
			    		}
			        }
	        })
	        .state("explore", {
	        	parent: 'secure',
	        	name:'explore',
	      		url: '/explore',
	      		templateUrl: 'views/explore.html',
						controller: 'CatalogController'
	        })
	        .state("catalog-filter-tax", {
	        	parent: 'secure',
	      		url: '/catalog/filter-tax/component_id/:component_id/component_name/:component_name/system_id/:system_id/system_name/:system_name/subsystem_id/:subsystem_id/subsystem_name/:subsystem_name',
	      		templateUrl: 'views/catalog.html',
	    		controller: 'CatalogController',
				params:{
					component_id: { squash: true, value: null},
					component_name: { squash: true, value: null},
					system_name:{ squash: true, value: null},
					system_id: { squash: true, value: null},
					subsystem_name: { squash: true, value: null},
					subsystem_id: { squash: true, value: null}
				}
	        })
			 .state("catalog-filter", {
				 parent: 'secure',
	      		url: '/catalog/filter/component/:component_id/:component_name/system/:system_id/:system_name/subsystem/:subsystem_id/:subsystem_name/asset/:asset_id/:asset_name/fuel/:fuel_id/:fuel_name',
	      		templateUrl: 'views/catalog.html',
	    		controller: 'CatalogController',
				params:{
					component_id: { squash: true, value: null},
					component_name: { squash: true, value: null},
					system_name:{ squash: true, value: null},
					system_id: { squash: true, value: null},
					subsystem_name: { squash: true, value: null},
					subsystem_id: { squash: true, value: null},
					asset_name:{ squash: true, value: null},
					asset_id:{ squash: true, value: null},
					fuel_name:{ squash: true, value: null},
					fuel_id:{ squash: true, value: null}
				}
	        })
			.state("catalog", {
				parent: 'secure',
	      		url: '/catalog',
	      		templateUrl: 'views/catalog.html',
	    		controller: 'CatalogController',
				params:{
					component_id: null,
					component_name: null,
					system_name:null,
					system_id: null
				}
	        })
	        .state("gas-catalog", {
	        	parent: 'secure',
	        	 name:'gas-catalog',
	             url: '/gas-catalog',
	             templateUrl: 'views/gas-catalog.html'
	        })
	        .state("trans-catalog", {
	        	parent: 'secure',
	            name:'trans-catalog',
	            url: '/trans-catalog',
	            templateUrl: 'views/trans-catalog.html'
	        })
	        .state("analytic", {
	        	parent: 'secure',
	        	 name:'analytic',
	             url: '/analytic/:analyticID',
	             templateUrl: 'views/analytic.html',
	             params: {
	            	 analyticObj:{}
	                },
	             controller: 'AnalyticDetailController'
	        })
	        .state("workbench", {
	        	parent: 'secure',
	        	name:'workbench',
	      		url: '/workbench',
	      		templateUrl: 'views/workbench.html',
	      		controller: 'workbenchController'
	        })
	 /* $urlRouterProvider.when("", "/coverage");
  	var exploreState = {
  		name:'explore',
  		url: '/explore',
  		templateUrl: 'views/explore.html',
			controller: 'CatalogController'
  	}

  	var catalogState = {
  		name:'catalog',
  		url: '/catalog',
  		templateUrl: 'views/catalog.html',
		controller: 'CatalogController'
  	}

      var gascatalogState = {
        name:'gas-catalog',
        url: '/gas-catalog',
        templateUrl: 'views/gas-catalog.html'
      }

      var transcatalogState = {
        name:'trans-catalog',
        url: '/trans-catalog',
        templateUrl: 'views/trans-catalog.html'
      }

    var analyticState = {
      name:'analytic',
      url: '/analytic/:analyticID',
      templateUrl: 'views/analytic.html',
      controller: 'AnalyticDetailController'
    }

  	var coverageState = {
  		name:'coverage',
  		url: '/coverage',
  		templateUrl: 'views/coverage.html',
  		controller: 'CoverageController'
  	}

  	var workbenchState = {
  		name:'workbench',
  		url: '/workbench',
  		templateUrl: 'views/workbench.html'
  	}
  	var analyticCount = {
  	  		name:'analyticCount',
  	  		url: '/analyticCount',
  	  		templateUrl: 'views/analyticCount.html',
  	  		controller: 'analyticCountCtrl'
  	  	}
  	var analyticCount1 = {
  	  		name:'analyticCount.a1',
  	  		url: '/table',
  	  		templateUrl: 'views/analyticCount.html',
  	  		controller: 'analyticCountCtrl'
  	  	}
  	
	  $stateProvider.state(exploreState);
	  $stateProvider.state(catalogState);
      $stateProvider.state(gascatalogState);
      $stateProvider.state(transcatalogState);
      $stateProvider.state(analyticCount);
      $stateProvider.state(analyticCount1);
    $stateProvider.state(analyticState);
	  $stateProvider.state(coverageState);
<<<<<<< HEAD
	  $stateProvider.state(workbenchState);
		$urlRouterProvider.when('', '/catalog');
=======
	  $stateProvider.state(workbenchState);*/
	  /*$stateProvider
	  .state("analyticCount", {
          url: "/analyticCount",
          templateUrl: 'views/analyticCount.html',
	  		controller: 'analyticCountCtrl'
      })
      .state("analyticCount.a1", {
          url: "/analyticCount",
          templateUrl: 'views/analyticCount1.html',
	  		controller: 'analyticCountCtrl'
      });*/

  });
   
 /*  ---------------------------------------Jquery Loader-------------------------------------------------*/
   var ajaxindicatorstart = function (text)
   {
if(text===undefined)
text='Loading Data...Please Wait...'; 
                   if($('body').find('#resultLoading').attr('id') != 'resultLoading'){
                   $('body').append('<div id="resultLoading" style="display:none"><div><img src="../images/bx_loader.gif"><div>'+text+'</div></div><div class="bg"></div></div>');
                   }
                   
                   $('#resultLoading').css({
                                   'width':'100%',
                                   'height':'100%',
                                   'position':'fixed',
                                   'z-index':'10000000',
                                   'top':'0',
                                   'left':'0',
                                   'right':'0',
                                   'bottom':'0',
                                   'margin':'auto'
                   });           
                   
                  $('#resultLoading .bg').css({
                                   'background':'#000000',
                                   'opacity':'0.65',
                                   'width':'100%',
                                   'height':'100%',
                                   'position':'absolute',
                                   'top':'0'
                   });
                   
                   $('#resultLoading>div:first').css({
                                   'width': '250px',
                                   'height':'75px',
                                   'text-align': 'center',
                                   'position': 'fixed',
                                   'top':'0',
                                   'left':'0',
                                   'right':'0',
                                   'bottom':'0',
                                   'margin':'auto',
                                   'font-size':'16px',
                                   'z-index':'10',
                                   'color':'#ffffff'
                                   
                   });

       $('#resultLoading .bg').height('100%');
$('#resultLoading').fadeIn(300);
       $('body').css('cursor', 'wait');
   }

   var ajaxindicatorstop = function ()
   {
       $('#resultLoading .bg').height('100%');
$('#resultLoading').fadeOut(500);
       $('body').css('cursor', 'default');
   }
$.loader_show = ajaxindicatorstart;
$.loader_hide = ajaxindicatorstop;

/*---------------------------------------Jquery Loader-------------------------------------------------*/




})();
