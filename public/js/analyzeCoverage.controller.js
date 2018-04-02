(function() {
  'use strict';

  angular.module("myApp")
    .controller('analyzeCoverageCtrl',['$scope','analyzeCoverageService','$state','$rootScope','$timeout', function ($scope,analyzeCoverageService,$state,$rootScope,$timeout) {
    	$rootScope.currentParent=$state.current.name;
    	sessionStorage.setItem('currentPage',$state.current.name);
    	function resize(){
			var offset=$rootScope.isOpen?230:50;
			document.getElementById('mainView').style.width=($(window).width()-offset-10)+'px';
			document.getElementById('mainView').style.height=($(window).height()-64)+'px';
		}
		$(window).off('resize');
		$(window).on('resize',function() {
			if($state.current.name == 'coverage.analyzeCoverage')
				setTimeout(function(){resize();},200);
		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.analyzeCoverage')
				setTimeout(function(){resize();},200);
		});
    	$scope.filesArray=[];
    	$scope.showCoverageTable=false;
    	$("#upload-file").click();
    	$('.drop').on('dragenter',function(event){
    	    event.preventDefault();
    	});
    	$('.drop').on('dragover',function(event){
    	    event.preventDefault();
    	});
    	$('.drop').on('drop dragdrop', function(e) {
    	    e.preventDefault();
    	    e.stopPropagation();
    	    console.log(e.originalEvent.dataTransfer.files);
    	    if (e.originalEvent.dataTransfer){
    	        if (e.originalEvent.dataTransfer.files.length > 0) {
    				if(e.originalEvent.dataTransfer.files.length>2){
    					new PNotify({
							title: 'Failed',
							text: "Maximum of 2 files can be dragged",
							type: 'error',
							buttons: {
								classes: {
									closer: 'fa fa-close',
									pin_up: '',
									pin_down: ''
								}
							}
						});
    				}else{
    					if($scope.filesArray.length >= 2 || (e.originalEvent.dataTransfer.files.length+$scope.filesArray.length) > 2){
    						new PNotify({
    							title: 'Failed',
    							text: "Maximum of 2 files can be added",
    							type: 'error',
    							buttons: {
    								classes: {
    									closer: 'fa fa-close',
    									pin_up: '',
    									pin_down: ''
    								}
    							}
    						});
    					}
    					else{
    						var hasSameFile=false;
    						 var sameformat;
    						$.each(e.originalEvent.dataTransfer.files,function(i,val){
    			                if(val.name.split('.')[1] == sameformat){
    			                	hasSameFile=true;
    			                	new PNotify({
    	    							title: 'Failed',
    	    							text: "Select one csv and one excel File",
    	    							type: 'error',
    	    							buttons: {
    	    								classes: {
    	    									closer: 'fa fa-close',
    	    									pin_up: '',
    	    									pin_down: ''
    	    								}
    	    							}
    	    						});
    			                    return false;
    			                }
    			              sameformat=val.name.split('.')[1];
    			            });
    						if(!hasSameFile)
    						$scope.fileAdd(e.originalEvent.dataTransfer.files);
    					}
    					
    				}
    					
    	        }
    	    }
    	    return false;
    	});
    	$scope.fileAdd=function(files){
    		$timeout(function(){
    			$.each(files,function(i,val){
    				var file=val;
    				var name=file.name;
    				var size=Math.round(file.size/1024*100)/100;
    				if($scope.checkDuplicateName(name)){
    					new PNotify({
							title: 'Failed',
							text: "This File is already present in the Upload list",
							type: 'error',
							buttons: {
								classes: {
									closer: 'fa fa-close',
									pin_up: '',
									pin_down: ''
								}
							}
						});
    				}
    				else{
    					if(val.name.split('.')[1] == 'csv' || val.name.split('.')[1] == 'xlsx'){
    						$scope.filesArray.push({'name':name,'format':val.name.split('.')[1],"fileSize":size,"file":file});
    					}
    					else{
						new PNotify({
							title: 'Error',
							text: "Please Upload file Either in csv or xlsx format",
							type: 'error',
							buttons: {
								classes: {
									closer: 'fa fa-close',
									pin_up: '',
									pin_down: ''
								}
							}
							});
						return false;
    					}
    				}
    				
    			});
    		},0);
    	};
    	$scope.uploadfiles=function(){
    		$.loader_show();
    		analyzeCoverageService.analyzeServiceCall($scope.filesArray).then(function(data){
    			$scope.showCoverageTable=true;
    			$scope.coverageData=data.summary;
    			$scope.responseData=data;
    			if($('#uploadFile').hasClass('in')){
    				$("#upload-file").click();	
    			}
    			if(!$('#collapseOne').hasClass('in')){
    				$("#coverage-result").click();	
    			}
    			$scope.downloadCsv(data,'opportunity');
				$scope.downloadCsv(data,'summary');
				$.loader_hide();
				$('#opportunity-upload').val('');
    			$('#summary-upload').val('');
    			},function(error){
//    				$scope.showCoverageTable=true;
//    				var data= {"opportunity":[{"NAC":0,"End":1494778980000,"CAUSE CODE DESCRIPTION":"Reserve shutdown","Start":1494720300000,"FORCED_OUTAGE_FLAG":null,"Type":"RS","OPPORTUNITY_FLAG_SS":null,"index":211,"ANALYTICS_MND":null,"ANALYTICS_CNT":null,"HIGH_COVERAGE":null,"ANALYTICS_BACKLOG":null,"OPPORTUNITY_FLAG_MND":null,"ANALYTICS_AVAILABLE":null,"GAC":0,"ANALYTICS_SS":null,"OPPORTUNITY_FLAG":null,"AMP CODE":null,"Equiv Hrs":16.3,"ANALYTICS_CNT_SS":null,"BACKLOGS_CNT":null,"ANALYTICS_CNT_MND":null,"OPPORTUNITY_FLAG_BACKLOG":null,"CAUSE CODE":0,"COVERAGE":null,"MEDIUM_COVERAGE":null,"BLUEPRINT_NAME":null,"Cont":1,"DESCRIPTION":"RESERVE SHUTDOWN","Equiv MWH":8557.5,"Duration":16.3,"Event":53,"Unit":"Unit 4"},{"NAC":0,"End":1494818280000,"CAUSE CODE DESCRIPTION":"Reserve shutdown","Start":1494807600000,"FORCED_OUTAGE_FLAG":null,"Type":"RS","OPPORTUNITY_FLAG_SS":null,"index":212,"ANALYTICS_MND":null,"ANALYTICS_CNT":null,"HIGH_COVERAGE":null,"ANALYTICS_BACKLOG":null,"OPPORTUNITY_FLAG_MND":null,"ANALYTICS_AVAILABLE":null,"GAC":0,"ANALYTICS_SS":null,"OPPORTUNITY_FLAG":null,"AMP CODE":null,"Equiv Hrs":2.9667,"ANALYTICS_CNT_SS":null,"BACKLOGS_CNT":null,"ANALYTICS_CNT_MND":null,"OPPORTUNITY_FLAG_BACKLOG":null,"CAUSE CODE":0,"COVERAGE":null,"MEDIUM_COVERAGE":null,"BLUEPRINT_NAME":null,"Cont":1,"DESCRIPTION":"RESERVE SHUTDOWN","Equiv MWH":1557.5,"Duration":2.967,"Event":54,"Unit":"Unit 4"},{"NAC":0,"End":1494949020000,"CAUSE CODE DESCRIPTION":"Reserve shutdown","Start":1494925500000,"FORCED_OUTAGE_FLAG":null,"Type":"RS","OPPORTUNITY_FLAG_SS":null,"index":213,"ANALYTICS_MND":null,"ANALYTICS_CNT":null,"HIGH_COVERAGE":null,"ANALYTICS_BACKLOG":null,"OPPORTUNITY_FLAG_MND":null,"ANALYTICS_AVAILABLE":null,"GAC":0,"ANALYTICS_SS":null,"OPPORTUNITY_FLAG":null,"AMP CODE":null,"Equiv Hrs":6.5333,"ANALYTICS_CNT_SS":null,"BACKLOGS_CNT":null,"ANALYTICS_CNT_MND":null,"OPPORTUNITY_FLAG_BACKLOG":null,"CAUSE CODE":0,"COVERAGE":null,"MEDIUM_COVERAGE":null,"BLUEPRINT_NAME":null,"Cont":1,"DESCRIPTION":"RESERVE SHUTDOWN","Equiv MWH":3430,"Duration":6.533,"Event":55,"Unit":"Unit 4"}],"summary":{"POTENTIAL SAVING DUE TO SS(MWH)":58553.417,"MWH REDUCTION DUE TO FORCED OUTAGES(FO)":179998.004,"ADDITIONAL FORCED OUTAGES REDUCTION THRU BACKLOG(NOS)":null,"ASSUMING 50% DETECTION RATE - ADDITIONAL POTENTIAL SAVING DUE TO MND(MWH)":11758,"TOTAL POTENTIAL FORCED OUTAGES REDUCTION(NOS)":null,"ASSUMING 50% DETECTION RATE - TOTAL SAVING POTENTIAL(MWH)":null,"ASSUMING 50% DETECTION RATE - ADDITIONAL POTENTIAL SAVING DUE TO BACKLOG(MWH)":null,"ADITiONAL SAVING POTENTIAL DUE TO MND(MWH)":23516,"TOTAL SAVING POTENTIAL(MWH)":null,"FORCED OUTAGES THAT COULD HAVE BEEN REDUCED THRU SS(NOS)":16,"ASSUMING 50% DETECTION RATE - POTENTIAL SAVING DUE TO SS(MWH)":29276.7085,"TOTAL NO OF FORCED OUTAGES":38,"ADITiONAL SAVING POTENTIAL DUE TO BACKLOG(MWH)":null,"ADDITIONAL FORCED OUTAGES REDUCTION THRU MND(NOS)":8}};
//				$scope.downloadCsv(data,'opportunity');
//  				$scope.downloadCsv(data,'summary');
    				new PNotify({
						title: 'Error',
						text: "Unable to connect to the Services. Try Again !",
						type: 'error',
						buttons: {
							classes: {
								closer: 'fa fa-close',
								pin_up: '',
								pin_down: ''
							}
						}
						});
    				$.loader_hide();
    			});	
    	}
    	$scope.checkDuplicateName=function(name){
            var flag=false;
            $.each($scope.filesArray,function(i,val){
                if(val.name==name){
                    flag=true;
                    return false;
                }
            });
            return flag;
        };
        $scope.checkName=function(name){
    		return $scope.fileNames.indexOf(name) > -1 ? false : true;
    	};
    	$scope.removeItem=function(name){
    		$.each($scope.filesArray,function(i,val){
    			if(val.name==name){
    				if(val.format == 'xlsx'){
    					$('#summary-upload').val('');
    				}
    				if(val.format == 'csv'){
    					$('#opportunity-upload').val('');
    				}
    				$scope.filesArray.splice(i,1);
    				return false;
    			}
    		});
    	};
    	$('#opportunity-upload').on('change',function(){
    		var $this=$(this);
    		var value=$(this).val();
    		var fileRegex = /^.*\.(csv)$/;
    		$timeout(function(){
    			if(value!=='' && value.toLowerCase()!='no file choosen'){
    					if (!fileRegex.test(value.toLowerCase())){
    					  new PNotify({
  							title: 'Error',
  							text: "Please choose/Import a valid csv file.",
  							type: 'error',
  							buttons: {
  								classes: {
  									closer: 'fa fa-close',
  									pin_up: '',
  									pin_down: ''
  								}
  							}
  							});
    					}else{
    						if($scope.filesArray.length >= 2 || ($('#opportunity-upload')[0].files.length+$scope.filesArray.length) > 2){
        						new PNotify({
        							title: 'Failed',
        							text: "Maximum of 2 files can be added",
        							type: 'error',
        							buttons: {
        								classes: {
        									closer: 'fa fa-close',
        									pin_up: '',
        									pin_down: ''
        								}
        							}
        						});
        					}
        					else{
        						if($scope.filesArray.length > 0){
        						if($scope.filesArray[0].format == 'csv'){
        							new PNotify({
            							title: 'Error',
            							text: "Opportunity file Already exist.Upload Summary file",
            							type: 'error',
            							buttons: {
            								classes: {
            									closer: 'fa fa-close',
            									pin_up: '',
            									pin_down: ''
            								}
            							}
            						});
        							//$('#opportunity-upload').val($scope.lastFileUploaded);
        						}
        						else{
        							//$scope.lastFileUploaded=$('#opportunity-upload')[0].files[0].name;
        							$scope.fileAdd($('#opportunity-upload')[0].files);
        						}
        					 }
        					 else{
        						// $scope.lastFileUploaded=$('#opportunity-upload')[0].files[0].name;
        						 $scope.fileAdd($('#opportunity-upload')[0].files);
        						}
        					}
    						
    					}
    			}
    		},0);
    	});
    	$('#summary-upload').on('change',function(){
    		var $this=$(this);
    		var value=$(this).val();
    		var fileRegex = /^.*\.(xlsx)$/;
    		$timeout(function(){
    			if(value!=='' && value.toLowerCase()!='no file choosen'){
    					if (!fileRegex.test(value.toLowerCase())){
    					  new PNotify({
    							title: 'Error',
    							text: "Please choose/Import a valid xlsx file.",
    							type: 'error',
    							buttons: {
    								classes: {
    									closer: 'fa fa-close',
    									pin_up: '',
    									pin_down: ''
    								}
    							}
    							});
    					}else{
    						if($scope.filesArray.length >= 2 || ($('#summary-upload')[0].files.length+$scope.filesArray.length) > 2){
        						new PNotify({
        							title: 'Failed',
        							text: "Maximum of 2 files can be added",
        							type: 'error',
        							buttons: {
        								classes: {
        									closer: 'fa fa-close',
        									pin_up: '',
        									pin_down: ''
        								}
        							}
        						});
        					}
        					else{
        						
        						if($scope.filesArray.length > 0){
            						if($scope.filesArray[0].format == 'xlsx'){
            							new PNotify({
                							title: 'Error',
                							text: "Summary file Already exist.Upload Opportunity file",
                							type: 'error',
                							buttons: {
                								classes: {
                									closer: 'fa fa-close',
                									pin_up: '',
                									pin_down: ''
                								}
                							}
                						});
            						}
            						else{
            							$scope.fileAdd($('#summary-upload')[0].files);
            						}
            					 }
            					 else{
            						 $scope.fileAdd($('#summary-upload')[0].files);
            						}
            					}
        					}
    			}
    		},0);
    	});
    	
    	$scope.downloadCsv=function(data,type){
    	var tableToExcel = (function() {
				var uri = 'data:application/vnd.ms-excel;base64,'
					, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
					, base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
					, format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
				return function(table) {
				var excelContent = '';
				var th = "<th style='width: auto; padding-right:5px; background-color:#00BCD4'>";
				var tdNumber = "<td style='mso-number-format:0'>";
				if(type == 'opportunity'){
					var columns = ["NAC","End","CAUSE CODE DESCRIPTION","Start","FORCED_OUTAGE_FLAG","Type","OPPORTUNITY_FLAG_SS","index","ANALYTICS_MND","ANALYTICS_CNT","HIGH_COVERAGE","ANALYTICS_BACKLOG","OPPORTUNITY_FLAG_MND","ANALYTICS_AVAILABLE","GAC","ANALYTICS_SS","OPPORTUNITY_FLAG","AMP CODE","Equiv Hrs","ANALYTICS_CNT_SS","BACKLOGS_CNT","ANALYTICS_CNT_MND","OPPORTUNITY_FLAG_BACKLOG","CAUSE CODE","COVERAGE","MEDIUM_COVERAGE","BLUEPRINT_NAME","Cont","DESCRIPTION","Equiv MWH","Duration","Event","Unit"];
					var getDataFromDT  = data.opportunity;
					excelContent = excelContent + '</tr>';
					_.forEach(columns, function(column){
							excelContent = excelContent + th + column + '</th>';
					});
					excelContent = excelContent + '</tr>';
					_.forEach(getDataFromDT, function(row){
						excelContent =excelContent + '<tr>';
						_.forEach(row, function(rowData){
							if((/^[0-9]{0,}$/).test(rowData))
								excelContent = excelContent + tdNumber + rowData + '</td>';
							else if(rowData===null)
									excelContent = excelContent+ '<td></td>';
							else
								excelContent = excelContent + '<td>' + rowData + '</td>';
						});
						excelContent =excelContent + '</tr>';
					});
					var ctx = {worksheet: 'Opportunity Data ' , table: excelContent};
					document.getElementById('export-opportunity').href = (uri + base64(format(template, ctx)));
					document.getElementById('export-opportunity').download = 'Opportunity_data.xls';
				}
				if(type == 'summary'){
					var columns = ["POTENTIAL SAVING DUE TO SS(MWH)","MWH REDUCTION DUE TO FORCED OUTAGES(FO)","ADDITIONAL FORCED OUTAGES REDUCTION THRU BACKLOG(NOS)","ASSUMING 50% DETECTION RATE - ADDITIONAL POTENTIAL SAVING DUE TO MND(MWH)",
					               "TOTAL POTENTIAL FORCED OUTAGES REDUCTION(NOS)","ASSUMING 50% DETECTION RATE - TOTAL SAVING POTENTIAL(MWH)","ASSUMING 50% DETECTION RATE - ADDITIONAL POTENTIAL SAVING DUE TO BACKLOG(MWH)","ADITiONAL SAVING POTENTIAL DUE TO MND(MWH)",
					               "TOTAL SAVING POTENTIAL(MWH)","FORCED OUTAGES THAT COULD HAVE BEEN REDUCED THRU SS(NOS)","ASSUMING 50% DETECTION RATE - POTENTIAL SAVING DUE TO SS(MWH)","TOTAL NO OF FORCED OUTAGES","ADITiONAL SAVING POTENTIAL DUE TO BACKLOG(MWH)",
					               "ADDITIONAL FORCED OUTAGES REDUCTION THRU MND(NOS)"];
					
					var getDataFromDT  = data.summary;
					excelContent =excelContent + '<tr>';
					_.forEach(columns, function(column){
							excelContent = excelContent + th + column + '</th>';
					});
					excelContent = excelContent + '</tr>';
					_.forEach(getDataFromDT, function(row){
							if((/^[0-9]{0,}$/).test(row))
								excelContent = excelContent + tdNumber + row + '</td>';
							else if(row===null)
									excelContent = excelContent+ '<td></td>';
							else
								excelContent = excelContent + '<td>' + row + '</td>';
						
					});
					excelContent =excelContent + '</tr>';
					var ctx = {worksheet: 'Summary Data ' , table: excelContent};
					document.getElementById('export-summary').href = (uri + base64(format(template, ctx)));
					document.getElementById('export-summary').download = 'Summary_data.xls';
				}
			}
			})();
    		tableToExcel();
    	}
    }]);
})();