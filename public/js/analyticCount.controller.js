(function() {
  'use strict';

  angular.module("myApp")
    .controller('analyticCountCtrl',['$scope','AnalyticCountService','$state','$rootScope','$stateParams','dataStorage','NetworkCallService','$timeout', function ($scope,AnalyticCountService,$state,$rootScope,$stateParams,dataStorage,NetworkCallService,$timeout) {
    
    $.loader_show();	
    $scope.assetChartData=[];
	$rootScope.currentParent=$state.current.name;
	$scope.expandTrue=true;
	$scope.showCard=false;
	$scope.systemData=[];
	$scope.subSystemData=[];
	sessionStorage.setItem('currentPage',$state.current.name);
  	$(window).off('resize');
  	$scope.fuelNameSelected=$stateParams.fuelSelected.fuel_name;
  	/*$scope.dashboardSection={
		  		"background": "linear-gradient(to right, #284069, #5b3e67)"	
		  	};*/
  	//$scope.count=[{"subSystemCount":7,"systemCount":6,"componentCount":40,"analyticCount":106,"assetId":2,"assetName":"AER0-DERIVATIVE","failureCount":21},{"subSystemCount":17,"systemCount":7,"componentCount":56,"analyticCount":193,"assetId":7,"assetName":"BALANCE OF PLANT","failureCount":28},{"subSystemCount":1,"systemCount":1,"componentCount":1,"analyticCount":1,"assetId":14,"assetName":"EXPANDER TURBINE","failureCount":1},{"subSystemCount":1,"systemCount":1,"componentCount":3,"analyticCount":2,"assetId":9,"assetName":"EXTERNAL","failureCount":0},{"subSystemCount":7,"systemCount":6,"componentCount":64,"analyticCount":225,"assetId":1,"assetName":"GAS TURBINE","failureCount":34},{"subSystemCount":5,"systemCount":5,"componentCount":23,"analyticCount":180,"assetId":5,"assetName":"GENERATOR","failureCount":21},{"subSystemCount":13,"systemCount":6,"componentCount":58,"analyticCount":188,"assetId":6,"assetName":"HRSG BOILER","failureCount":15},{"subSystemCount":1,"systemCount":1,"componentCount":1,"analyticCount":6,"assetId":13,"assetName":"PERFORMANCE","failureCount":1},{"subSystemCount":4,"systemCount":3,"componentCount":24,"analyticCount":5,"assetId":8,"assetName":"POLLUTION CONTROL EQUIPMENT","failureCount":2},{"subSystemCount":2,"systemCount":2,"componentCount":4,"analyticCount":12,"assetId":10,"assetName":"REGULATORY, SAFETY, ENVIRONMENTAL","failureCount":5},{"subSystemCount":7,"systemCount":7,"componentCount":25,"analyticCount":218,"assetId":4,"assetName":"STEAM TURBINE","failureCount":20}];

  	var offset;
     function resize(){
    	 if($scope.expandTrue)
			{
        	 document.getElementById('dashboardDiv').style.height=$( window ).height()-64+'px';
        	 document.getElementById('section-1').style.height=($( window ).height()-124)/2+'px';
        	 document.getElementById('section-2').style.height=($( window ).height()-124)/2+'px';
        	 document.getElementById('mainView').style.height=($(window).height()-64)+'px';
        	 offset=$rootScope.isOpen?230:50;
        	 document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
        	 document.getElementById('dashboardDiv').style.width=($(window).width()-offset)+'px';
        	 document.getElementById('section-1').style.width=($(window).width()-offset-30)+'px';
        	 document.getElementById('section-2').style.width=($(window).width()-offset-30)+'px';
        	 document.getElementById('overallDiv').style.width=(($('#section-1').width()-20)/2)+'px';
        	 document.getElementById('assetDiv1').style.width=(($('#section-1').width()-20)/2)+'px';
        	 document.getElementById('systemDiv').style.width=(($('#section-1').width()-20)/2)+'px';
        	 document.getElementById('subSystemDiv').style.width=(($('#section-1').width()-20)/2)+'px';
        	 $scope.overall.setSize($('#overallDiv').width(), $('#overallDiv').height()-30,true);
        	 $scope.system.setSize($('#systemDiv').width(), $('#systemDiv').height()-30,true);
         	 $scope.subSystem.setSize($('#subSystemDiv').width(), $('#subSystemDiv').height()-30,true);
         	 if($scope.asset != undefined)
         	 $scope.asset.setSize($('#assetDiv1').width(), $('#assetDiv1').height()-30,true);
    		     		 
			}
    	 else{
    		 offset=$rootScope.isOpen?230:50;
         	 document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
         	 document.getElementById('dashboardDiv').style.width=($(window).width()-offset)+'px';
    		 $timeout(function(){
    			 document.getElementById($scope.divExpanded).style.width=document.getElementById('dashboardDiv').offsetWidth-60+'px';
 	 			document.getElementById($scope.divExpanded).style.height=document.getElementById('dashboardDiv').offsetHeight-70+'px';
 	 			if($scope.divExpanded == "assetDiv1")
 					{
 					
 	 				$scope.asset.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
 	 				$('#asset').highcharts().xAxis[0].update({labels:{rotation:0}});
 					}
 	 			if($scope.divExpanded == "systemDiv")
 					{
 					
 	 				$scope.system.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
 					
 					}
 	 			if($scope.divExpanded == "overallDiv")
 					{
 					
 	 				$scope.overall.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
 					
 					}
 	 		
 	 			if($scope.divExpanded == "subSystemDiv")
 				{
 				
 				$scope.subSystem.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
 				
 				}
    		 },0);
    	 }
     }
     function resizeExpand(){
    	 
    	 document.getElementById('dashboardDiv').style.height=$( window ).height()-64+'px';
    	 document.getElementById('section-1').style.height=($( window ).height()-124)/2+'px';
    	 document.getElementById('section-2').style.height=($( window ).height()-124)/2+'px';
    	 document.getElementById('mainView').style.height=($(window).height()-64)+'px';
    	 offset=$rootScope.isOpen?230:50;
    	// console.log($(window).width());
    	 document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
    	 document.getElementById('dashboardDiv').style.width=($(window).width()-offset)+'px';
    	 document.getElementById('section-1').style.width=($(window).width()-offset-30)+'px';
    	 document.getElementById('section-2').style.width=($(window).width()-offset-30)+'px';
    	 document.getElementById('overallDiv').style.width=(($('#section-1').width()-20)/2)+'px';
    	// document.getElementById('assetDiv2').style.width=($('#section-1').width()-(($('#section-1').width()-20)/3)-10)+'px';
    	 document.getElementById('assetDiv1').style.width=(($('#section-1').width()-20)/2)+'px';
    	 document.getElementById('systemDiv').style.width=(($('#section-1').width()-20)/2)+'px';
    	 document.getElementById('subSystemDiv').style.width=(($('#section-1').width()-20)/2)+'px';
    	
    	 $scope.overall.setSize($('#overallDiv').width(), $('#overallDiv').height()-30,true);
    	 $scope.system.setSize($('#systemDiv').width(), $('#systemDiv').height()-30,true);
     	 $scope.subSystem.setSize($('#subSystemDiv').width(), $('#subSystemDiv').height()-30,true);
     	// if($scope.barchart != undefined)
     	// $scope.barchart.setSize($('#assetDiv2').width(), $('#assetDiv2').height()-30,true);
     	 if($scope.asset != undefined)
     	 $scope.asset.setSize($('#assetDiv1').width(), $('#assetDiv1').height()-30,true);
    	 
     }
     $(window).on('resize',function() {
 		if($state.current.name == 'coverage.analyticCount'){
 			 $timeout(function(){  resize();  },100);
		}
		});
    $rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.analyticCount' && !jQuery.isEmptyObject($stateParams.fuelSelected)){
				 $timeout(function(){  resize();  
				// $scope.$apply();
				 },100);
			}
			
		});
     if(jQuery.isEmptyObject($stateParams.fuelSelected)){
 		$state.go('coverage.analyticDashboard');
 	}else{
 		  //$timeout(function(){  resize();  },100);
		AnalyticCountService.analyticCountCall($stateParams.fuelSelected.fuel_id,$rootScope.filterBy).then(function(data){
		$.loader_hide();
			document.getElementById('dashboardDiv').style.width=($(window).width()-offset)+'px';
			document.getElementById('dashboardDiv').style.height=$( window ).height()-64+'px';
			document.getElementById('mainView').style.height=($(window).height()-64)+'px';
		 

		$scope.allData=data.body;
		$scope.count=$scope.allData.scoreCard;
 		chartInit();
 		//$scope.barchart.setSize($('#assetDiv2').width(), $('#assetDiv2').height()-30,true);
 		$scope.system.setSize($('#systemDiv').width(), $('#systemDiv').height()-30,true);
 		$scope.asset.setSize($('#assetDiv1').width(), $('#assetDiv1').height()-30,true);
 		$scope.subSystem.setSize($('#subSystemDiv').width(), $('#subSystemDiv').height()-30,true);
     
		},function(error){
			alert('Unable to connect to the Services!');
			$.loader_hide();
		});	
 	}
     
     
   /*  Highcharts.setOptions({
         colors: ['#01bff3', '#ffbc75', '#ada7a7', '#ff7599','#6AF9C4','#90ed7d']
        });*/
     $scope.drawBarchart=function(){
    	
     }
     $scope.overall=new Highcharts.chart('overall', {
    	 chart: {
    		 type: 'pie',
    		 plotBackgroundColor: null,
    		 plotBorderWidth: null,
    		 plotShadow: false,
    		 backgroundColor: "none",

    	 },
    	 title: {
    		 text: ''
    	 },
    	 subtitle: {
    		 text: ''
    	 },
    	 credits: {
    		 enabled: false
    	 },	
    	 tooltip: {
    		 //pointFormat: 
    		 formatter: function() {
    			 if(this.key!=='Unplanned')
    				 return this.key+': <b>'+this.y+'</b>';
    			 else
    				 return false;
    		 }
    	 },
    	 legend: {
	 	        itemStyle: {
		            color: 'white',
		            fontWeight: 'bold'
		        },
		        itemHoverStyle: {
		            color: 'white'
		        }
	 	    },
    	 plotOptions: {
    		 pie: {
    			 innerSize: '40%',
    			 depth: '40%',
    			 size:'90%',
    			 allowPointSelect: true,
    			 cursor: 'pointer',
    			 colors: ['#8DC153','#ff925c','#9e9e9e'],
    			 showInLegend: true,
    			 dataLabels: {
    				 distance: 6,
    				 enable:true,
    				 align: 'right',
    				 useHTML: true,
    				 formatter: function() {
    					 if(this.key!=='Unplanned')
    						 return '<div class="toolTip">'+this.key+'<br>'+this.y.toFixed(2) + '%</div>';
    				 },
    				 style: {
    					 color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'White',
    					 fontSize: '11px'
    				 }
    			 }
    		 }
    	 },
    	 series: [{
    		 name: 'Delivered amount',
    		 data: [
    		        ['Overall',parseFloat($stateParams.fuelSelected.overallcount)],
                    ['Planned',parseFloat(10)],
			{
				 name: 'Unplanned',
				 y: 100-(parseFloat($stateParams.fuelSelected.overallcount)+parseFloat(10)),
				 showInLegend:false
				 
			}
    	 ]
    	 }]
     });
     
     (function (Highcharts) {
         var each = Highcharts.each;
         Highcharts.wrap(Highcharts.Legend.prototype, 'renderItem', function (proceed, item) {
             if (item.showInLegend != false) {
                 proceed.call(this, item);
             }
         });
         
         Highcharts.wrap(Highcharts.Legend.prototype, 'positionItem', function (proceed, item) {
             if (item.showInLegend != false) {
                 proceed.call(this, item);
             }
         });
     }(Highcharts));
  /* 
  	Highcharts.setOptions({
        colors: ['#da4453', '#f6bb42', '#3bafda', '#967adc', '#f18524', '#FF9655', '#FFF263','#6AF9C4']
       });*/
 	$scope.changeSystemGraph=function(id,color,name,seriesName){
 		//console.log(seriesName);
 		var data=_.filter($scope.allData.sysData,function(num){return num.asset_id==id});
 		var temp={};
	  	   var array1=[],array2=[],array3=[],xaxis=[];
	  	  $.each(data,function(i,val){
		  	   	array1.push({y:parseFloat(val.highCount),"color":color,"colorName":color,assetId:val.asset_id,systemId:val.system_id,system_name:val.system_name});
		  		array2.push({y:parseFloat(val.limitedCount),"color":color,"colorName":color,assetId:val.asset_id,systemId:val.system_id,system_name:val.system_name})
		  		array3.push({y:parseFloat(val.backlog),"color":color,"colorName":color,assetId:val.asset_id,systemId:val.system_id,system_name:val.system_name});
		  	   	xaxis.push(val.system_name);
		  	   });
	  	if(seriesName == "Backlog"){
	  		
	  	  temp={"xaxis":xaxis,"limitedCount":array3};
	  		
	  	}
		if(seriesName == "Analytic Coverage"){
			  		
			 temp={"xaxis":xaxis,"limitedCount":array1};
			  		
		}
		if(seriesName == "No Analytic Coverage"){
				
			 temp={"xaxis":xaxis,"limitedCount":array2};
				
		}
	  	   $timeout(function(){
	  		 $scope.assetNameSelected1=toTitleCase(name);
	  	   },0);
	  	   $scope.drawSystemGraph(temp,color,seriesName);
	  	   $timeout(function(){
	  	 $scope.changeSubSystemGraph(id,$scope.getSystemId(id,'system_id'),color,$scope.getSystemId(id,'system_name'),seriesName);
	  	   },0);	//if($scope.expandTrue)
 	};
 	$scope.changeSubSystemGraph=function(id,system_id,color,name,seriesName){
 		//console.log("SeriesName",seriesName);
 		var data=_.filter($scope.allData.subSysData,function(num){return num.asset_id==id && num.system_id==system_id});
 		var temp={};
	  	   var array1=[],array2=[],array3=[],xaxis=[];
	  	   $.each(data,function(i,val){
	  	   	array1.push({y:parseFloat(val.highCount),"color":color,"colorName":color});
	  		array2.push({y:parseFloat(val.limitedCount),"color":color,"colorName":color})
	  		array3.push({y:parseFloat(val.backlog),"color":color,"colorName":color});
	  	   	xaxis.push(val.subsystem_name);
	  	   });
	  		if(seriesName == "Backlog"){
		  		
	  	  	  temp={"xaxis":xaxis,"limitedCount":array3,"name":seriesName};
	  	  		
	  	  	}
	  		if(seriesName == "Analytic Coverage"){
	  			  		
	  			 temp={"xaxis":xaxis,"limitedCount":array1,"name":seriesName};
	  			  		
	  		}
	  		if(seriesName == "No Analytic Coverage"){
	  				
	  			 temp={"xaxis":xaxis,"limitedCount":array2,"name":seriesName};
	  				
	  		}
	  	 $timeout(function(){
	  		 $scope.systemNameSelected1=toTitleCase(name);
	  	   },0);
	  	 //	console.log(temp);
	  	   $scope.drawSubSystemGraph(temp,color);
	 			//if($scope.expandTrue)
 	};
 	$scope.draw=function(data){
 		//console.log(data);
 		$scope.asset = new Highcharts.chart('asset',  {
 	 	    chart: {
 	 	        type: 'column',
 	 	        plotBackgroundColor: null,
 		        plotBorderWidth: null,
 		        plotShadow: false,
 		        backgroundColor: "none",
 		        spacingTop:10
 		      
 	 	    },
 	 	    title: {
 	 	        text: '',
 	 	    },
 		    credits: {
 	            enabled: false
 	        },
 	 	    xAxis: {
 	 	       categories: data.xaxis,
 	 	       labels: {
 	 	    	   rotation:-20,
 		            style: {
 		                color: 'White'
 		            }
 		        }
 	 	    },
 	 	    yAxis: {
 	 	        title: {
 	 	            text: 'Number of Components',
 	 	           style: {
 		                color: 'White'
 		            }
 	 	        },
 	 	       labels: {
 		            style: {
 		                color: 'White'
 		            }
 		        },
 	 	        stackLabels: {
 	 	            enabled: false,
 	 	        }
 	 	    },
 	 	    legend: {
 	 	    	enabled: true,
 	 	        itemStyle: {
		            color: 'white',
		            fontWeight: 'bold'
		        },
		        itemHoverStyle: {
		            color: 'white'
		        }
 	 	    },
 	 	    tooltip: {
 	 	        headerFormat: '<b>{point.x}</b><br/>',
 	 	        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
 	 	    },
 	 	    plotOptions: {
 	 	        column: {
 	 	            stacking: 'normal',
 	 	            dataLabels: {
 	 	                enabled: true,
 	 	              formatter:function(){
 	                     if(this.y > 0)
 	                         return this.y;
 	                 },style: {
	  	                    fontWeight: 'bold',
	  	                    textOutline:'none'
	  	                    
	  	                }
 	 	            },
 	 	            point: {
		                events: {
		                  click: function() {
		                	 // console.log(this);
		                	  $scope.colorAsset=this.color;
		                	  $scope.changeSystemGraph(this.assetId,this.color,this.category,this.series.name);
		                  }
		                }
		              }
 	 	        },
 	 	        series:{
 	 	        	cursor: 'pointer'
 	 	        }
 	 	    },
 	 	    series: [{
 	 	        name: 'No Analytic Coverage',
 	 	        data: data.limitedCount,
 	 	        color:'#9e9e9e'
 	 	        
 	 	    },
 	 	    {
	 	        name: 'Backlog',
	 	        data: data.backlog,
 	 	        color:'#FF925C'
	 	    },
	 	   {
 	 	        name: 'Analytic Coverage',
 	 	        data: data.highCount,
 	 	        color:'#8DC153'
 	 	    }
 	 	    ]
 	 	});
 	};

 	$scope.drawSystemGraph=function(data,color,seriesName){
 		
 		 $timeout(function(){
 		   $scope.system.series[0].setData(data.limitedCount, true);
		   $scope.system.xAxis[0].update({categories:data.xaxis}, true);
		   $scope.system.legend.allItems[0].update({name:seriesName,color:color});
 		},0);  
	   };
	   $scope.drawSubSystemGraph=function(data,color){
		   $timeout(function(){
			   $scope.subSystem.series[0].setData(data.limitedCount, true);
			   $scope.subSystem.xAxis[0].update({categories:data.xaxis}, true);
			   $scope.subSystem.legend.allItems[0].update({name:data.name,color:color});
		   },0);
	   };
		   $scope.system = new Highcharts.chart('system',  {
	 	 	    chart: {
	 	 	        type: 'column',
	 	 	        plotBackgroundColor: null,
	 		        plotBorderWidth: null,
	 		        plotShadow: false,
	 		        backgroundColor: "none",
	 		        spacingTop:10
	 	 	    },
	 	 	    title: {
	 	 	        text: '',
	 	 	    },
	 	 	 
	 		    credits: {
	 	            enabled: false
	 	        },
	 	 	    xAxis: {
	 	 	       labels: {
	 	 	    	 rotation:0,
	 		            style: {
	 		                color: 'White'
	 		            }
	 		        },
	 	 	    },
	 	 	    yAxis: {
	 	 	        min: 0,
	 	 	        title: {
	 	 	            text: 'Number of Components',
	 	 	           style: {
	 		                color: 'White'
	 		            }
	 	 	        },
	 	 	       labels: {
	 		            style: {
	 		                color: 'White'
	 		            }
	 		        },
	 	 	        stackLabels: {
	 	 	            enabled: false,
	 	 	        }
	 	 	    },
	 	 	  legend: {
	 	 	    	enabled: true,
	 	 	      itemStyle: {
			            color: 'white',
			            fontWeight: 'bold'
			        },
			        itemHoverStyle: {
			            color: 'white'
			        }
	 	 	    },
	 	 	    tooltip: {
	 	 	        headerFormat: '<b>{point.x}</b><br/>',
	 	 	        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
	 	 	    },
	 	 	    plotOptions: {
	 	 	        column: {
	 	 	            stacking: 'normal',
	 	 	            dataLabels: {
	 	 	                enabled: true,
	 	 	                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
	 	 	              formatter:function(){
	  	                     if(this.y > 0)
	  	                         return this.y;
	  	                 },
	  	               style: {
	  	                    fontWeight: 'bold',
	  	                    textOutline:'none'
	  	                    
	  	                }
	 	 	            },
	 	 	          point: {
			                events: {
			                  click: function() {
			                	  $scope.changeSubSystemGraph(this.assetId,this.systemId,this.color,this.system_name,this.series.name);
			                  }
			                }
			              }
	 	 	        },
	 	 	        series:{
	 	 	        	cursor: 'pointer'
	 	 	        }
	 	 	    },
	 	 	    series: [{
	 	 	        name: "",
	 	 	        data:[]
	 	 	    }
	 	 	    ]
	 	 	});

		   $scope.subSystem = new Highcharts.chart('subSystem',  {
	 	 	    chart: {
	 	 	        type: 'column',
	 	 	        plotBackgroundColor: null,
	 		        plotBorderWidth: null,
	 		        plotShadow: false,
	 		        backgroundColor: "none",
	 		        spacingTop:10
	 		        
	 	 	    },
	 	 	    title: {
	 	 	        text: '',
	 	 	    },
	 		    credits: {
	 	            enabled: false
	 	        },
	 	 	    xAxis: {
	 	 	       categories: [],
	 	 	       labels: {
	 	 	    	 rotation:0,
	 		            style: {
	 		                color: 'White'
	 		            }
	 		        },
	 	 	    },
	 	 	    yAxis: {
	 	 	        min: 0,
	 	 	        title: {
	 	 	            text: 'Number of Components',
	 	 	           style: {
	 		                color: 'White'
	 		            }
	 	 	        },
	 	 	       labels: {
	 		            style: {
	 		                color: 'White'
	 		            }
	 		        },
	 	 	        stackLabels: {
	 	 	            enabled: false,
	 	 	        }
	 	 	    },
	 	 	  legend: {
	 	 	    	enabled: true,
	 	 	        itemStyle: {
			            color: 'white',
			            fontWeight: 'bold'
			        },
			        itemHoverStyle: {
			            color: 'white'
			        }
	 	 	    },
	 	 	    tooltip: {
	 	 	        headerFormat: '<b>{point.x}</b><br/>',
	 	 	        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
	 	 	    },
	 	 	    plotOptions: {
	 	 	        column: {
	 	 	            stacking: 'normal',
	 	 	            dataLabels: {
	 	 	                enabled: true,
	 	 	                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
	 	 	              formatter:function(){
	  	                     if(this.y > 0)
	  	                         return this.y;
	  	                 },
	  	               style: {
	  	                    fontWeight: 'bold',
	  	                    textOutline:'none'
	  	                    
	  	                }
	 	 	            }
	 	 	        }
	 	 	    },
	 	 	    series: [{
	 	 	        name: '',
	 	 	        data:[],
	 	 	        color:'#8DC153'
	 	 	    }
	 	 	    ]
	 	 	});
 	 		
 		function toTitleCase(str)
 		{
 		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
 		}
 		
 	
 		$('.expandIcon').on('click', function () {
 			$scope.divExpanded=$(this).parent()[0].id;
 			if($scope.expandTrue)
 				{
 				$(this).parent().siblings().hide();
 				if($('#'+$(this).parent()[0].id).parent()[0].id == "section-1"){
 					$('#'+$(this).parent()[0].id).parent().parent().find('#section-2').hide();
 				}
 				else{
 					$('#'+$(this).parent()[0].id).parent().parent().find('#section-1').hide();
 				}
 	 			$scope.perviousWidth=document.getElementById($(this).parent()[0].id).offsetWidth;
 	 			$scope.perviousHeight=document.getElementById($(this).parent()[0].id).offsetHeight;
 	 			document.getElementById($(this).parent()[0].id).style.width=document.getElementById('dashboardDiv').offsetWidth-60+'px';
 	 			document.getElementById($(this).parent()[0].id).style.height=document.getElementById('dashboardDiv').offsetHeight-70+'px';
 	 			
 	 			/*if($(this).parent()[0].id == "assetDiv")
 					{
 					
 	 				$scope.asset.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
 	 			
 					}*/
 	 			if($(this).parent()[0].id == "assetDiv1")
					{
					
	 				$scope.asset.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
	 				$('#asset').highcharts().xAxis[0].update({labels:{rotation:0}});
					}
 	 			if($(this).parent()[0].id == "systemDiv")
					{
					
	 				$scope.system.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
					
					}
 	 			if($(this).parent()[0].id == "overallDiv")
					{
					
	 				$scope.overall.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
					
					}
 	 			/*if($(this).parent()[0].id == "assetDiv2")
				{
				
 				$scope.barchart.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
				
				}*/
 	 			if($(this).parent()[0].id == "subSystemDiv")
				{
				
 				$scope.subSystem.setSize(document.getElementById('dashboardDiv').offsetWidth-80,document.getElementById('dashboardDiv').offsetHeight-125);	
				
				}
 				
 	 			
 				}
 			else{
 				console.log(offset);
 				$timeout(function(){resizeExpand();},100);
 				//document.getElementById('dashboardDiv').style.height=$( window ).height()-64+'px';
 	        	// document.getElementById('dashboardDiv').style.width=($(window).width()-offset)+'px';
 				
 				$(this).parent().siblings().show();
 	 			if($('#'+$(this).parent()[0].id).parent()[0].id == "section-1"){
 					$('#'+$(this).parent()[0].id).parent().parent().find('#section-2').show();
 				}
 				else{
 					$('#'+$(this).parent()[0].id).parent().parent().find('#section-1').show();
 				}
 	 			document.getElementById($(this).parent()[0].id).style.width=$scope.perviousWidth+'px';
 	 			document.getElementById($(this).parent()[0].id).style.height=$scope.perviousHeight+'px';
	 			if($(this).parent()[0].id == "systemDiv")
				{
				
	 				$scope.system.setSize(document.getElementById($(this).parent()[0].id).offsetWidth-10,document.getElementById($(this).parent()[0].id).offsetHeight-30);	
				
				}
	 			if($(this).parent()[0].id == "assetDiv1")
				{
	 				
	 				$scope.asset.setSize(document.getElementById($(this).parent()[0].id).offsetWidth-10,document.getElementById($(this).parent()[0].id).offsetHeight-30);	
	 				$('#asset').highcharts().xAxis[0].update({labels:{rotation:-20}});
				}
	 			/*if($(this).parent()[0].id == "assetDiv2")
				{
				
	 				$scope.barchart.setSize(document.getElementById($(this).parent()[0].id).offsetWidth-10,document.getElementById($(this).parent()[0].id).offsetHeight-30);	
				
				}*/
	 			if($(this).parent()[0].id == "overallDiv")
				{
				
	 				$scope.overall.setSize(document.getElementById($(this).parent()[0].id).offsetWidth-10,document.getElementById($(this).parent()[0].id).offsetHeight-30);	
				
				}
	 			if($(this).parent()[0].id == "subSystemDiv")
				{
				
	 				$scope.subSystem.setSize(document.getElementById($(this).parent()[0].id).offsetWidth-10,document.getElementById($(this).parent()[0].id).offsetHeight-30);	
				
				}
 				
 			}
 			$scope.expandTrue=!$scope.expandTrue;
 			$scope.$apply();
 			
 		});
 		function chartInit(){
 			
 			$scope.drawBarchart();
 	 		$scope.getSystemId=function(assetId,key){
 	 			var tempData=_.sortBy($scope.allData.sysData,function(num){num.asset_id});
 	 			var flag=0;
 	 			$.each(tempData,function(i,val){
 	 				if(val.asset_id===assetId){
 	 					flag=val[key];
 	 					return false;
 	 				}
 	 			});
 	 			return flag;
 	 		}
 	 		//add more colors here (greter than x axis category)
 	 		 $scope.colors= ['#da4453', '#f6bb42', '#3bafda', '#967adc', '#f18524', '#FFF263','#6AF9C4'];
 	 		var temp={};
 	 	  //colors: [ '#9e9e9e', '#FF925C','#8DC153'],
 	 	   var array1=[],array2=[],array3=[],xaxis=[];
 	 	   $.each($scope.allData.pieChart,function(i,val){
 	 	   	array1.push({y:parseFloat(val.highCount),color:"#8DC153",assetId:val.asset_id,assetName:val.assetName});
 	 	   	array2.push({y:parseFloat(val.limitedCount),color:"#9e9e9e",assetId:val.asset_id,assetName:val.assetName});
 	   	    array3.push({y:parseFloat(val.backlog),color:"#FF925C",assetId:val.asset_id,assetName:val.assetName});
 	 	   	xaxis.push(val.assetName);
 	 	   });
 	 	   temp={"xaxis":xaxis,"highCount":array1,"limitedCount":array2,"backlog":array3};
 	 	   $scope.draw(temp);
 	 	  // console.log($scope.allData.pieChart);
 	 	   $scope.changeSystemGraph($scope.allData.pieChart[0].asset_id,"#8DC153",$scope.allData.pieChart[0].assetName,"Analytic Coverage");
 	 	 
 			
 		}
 		$scope.backToMain=function(){
 			$state.go('coverage.analyticDashboard');
 		}
 		$scope.showCount=function(){
 			
 			if(!$scope.showCard){
 			document.getElementById('scoreCardLabel').innerHTML="Back";
 			/*$scope.dashboardSection={
 			  		"background": "white"	
 			  	};*/
 			}
 			else{
 				document.getElementById('scoreCardLabel').innerHTML="Score Card";
 			/*	$scope.dashboardSection={
 		  		  		"background": "linear-gradient(to right, #284069, #5b3e67)"	
 		  		  	};*/
 			}
 			$scope.showCard=!$scope.showCard;
 		}
 		
    }]);
})();