(function() {
  'use strict';

  angular.module("myApp")
    .controller('newlogicCtrl',['$scope','analyzeCoverageService','$state','$rootScope','$timeout','uiGridConstants','uiGridGroupingConstants', function ($scope,analyzeCoverageService,$state,$rootScope,$timeout,uiGridConstants,uiGridGroupingConstants) {
    	$rootScope.currentParent=$state.current.name;
    	sessionStorage.setItem('currentPage',$state.current.name);
    	$scope.gridHeight=400;
    	var actualArray;
    	var headerArray;
    	var length=0;
    	var arrayKeysLength=0;
    	var tempStorage="";
    	var forwardingArray=[];
    	var emptyFile=true;
    	var checkBlankRow=true;
    	var alphabetArray='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    	$scope.sheetNames=[];
    	$scope.myCountry = {
    			headerSelected:{},
    			comparisonSelected:{}
    			
    		};
    	$scope.headersArray={};
    	$scope.sheetList={};
    	$scope.appliedTable=false;
    	$scope.showInputTable=false;
    	function resize(){
			var offset=$rootScope.isOpen?230:50;
			document.getElementById('mainView').style.width=($(window).width()-offset-10)+'px';
			document.getElementById('mainView').style.height=($(window).height()-64)+'px';
			/*if($scope.gridHeight >  $(".ui-grid-canvas").height()){
				angular.element(document.getElementsByClassName('grid1')[0]).css('height', $(".ui-grid-canvas").height()+90 + 'px');
			}*/
		}
		$(window).off('resize');
		$(window).on('resize',function() {
			if($state.current.name == 'coverage.newlogic')
				setTimeout(function(){resize();},200);
		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.newlogic')
				setTimeout(function(){resize();},200);
		});
    	$scope.filesArray=[];
    	$("#upload-file").click();
    	$scope.appliedInput = {
				exporterMenuCsv: true,
				enableGridMenu: true,
				enableFiltering: true,
				exporterMenuPdf: false,
				data:'appliedData',
				//exporterCsvFilename: 'Input_File.csv',
				exporterMenuVisibleData:false,
				enableColumnResizing: true
		};
    	$scope.rawTableWithHeader = {
				exporterMenuCsv: true,
				enableGridMenu: true,
				enableFiltering: true,
				exporterMenuPdf: false,
				exporterCsvFilename: 'Raw_Input_File.csv',
				exporterMenuVisibleData:false,
				enableColumnResizing: true,
				data:'inputData',
				onRegisterApi: function (api) {
				    $scope.gridApi = api;
				  }
		};
    	$('#input-upload').on('change',function(changeEvent){
    		
			var reader = new FileReader();

			reader.onload = function (e) {
				var bstr = e.target.result;
				var wb = XLSX.read(bstr, {type:'binary'});
				$scope.uploadedFile = wb;
			};
			reader.readAsBinaryString(changeEvent.target.files[0]);
			$scope.fileName=$('#input-upload')[0].files[0].name;
			//$("#csv-file").val("");
			$.loader_hide();
		});
    	
    	
    	$scope.uploadFile =function(){
    		$scope.myCountry.headerSelected={};
    		$scope.myCountry.comparisonSelected={};
    		$scope.headStartIndex="";
    		$scope.headEndIndex="";
    		$scope.dataStartIndex="";
    		$scope.showInputTable=false;
    		$scope.sheetNames=[];
    		$scope.sheetList={};
    		$scope.inputData=""
    		$scope.rawTableWithHeader.columnDefs=[];
    		$scope.rawTableWithHeader.data='inputData';
    		if(!$('#inputFile').hasClass('in')){
				$("#input-file").click();	
			}
    		$.each($scope.uploadedFile.SheetNames,function(key,val){
    			$scope.sheetNames.push(val)
    		});
    		if($scope.sheetNames.length < 2){
    			$scope.sheetSelected($scope.sheetNames[0]);
    		}
    	}

		function getMaxLengthObj(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    if(size > length)
		    return size;
		    else
		    return length
		};
		function getMaxLengthArray(temp) {
		    if(temp.length > arrayKeysLength)
		    return temp.length;
		    else
		    return arrayKeysLength;
		};
    	$scope.sheetSelected=function(sheet){
    		//$scope.inputData="";
    		length=0;
    		arrayKeysLength=0;
    		emptyFile=true;
    		$scope.rawTableWithHeader.columnDefs=[];
    		//$scope.rawTableWithHeader.data='inputData';
    		
			var ws = $scope.uploadedFile.Sheets[sheet];

			var aoa = XLSX.utils.sheet_to_json(ws, {header:1, raw:false});
			
			$.each(aoa,function(key,val){
				arrayKeysLength = getMaxLengthArray(val);
				if(jQuery.isEmptyObject(val) == false){
					emptyFile=false;
				}
			});
		if(emptyFile){
			$scope.showInputTable=false;
					$.loader_hide();
					new PNotify({
						title: 'Empty File',
						text: 'Excel File is Empty',
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
			
				$scope.showInputTable=true;
				var cols = [],dataArray=[];
				
				for(var i = 0; i < aoa[0].length; ++i) cols[i] = { field: aoa[0][i] };

				var data = [];
				for(var r = 0; r < aoa.length; ++r) {
					data[r] = {};
					checkBlankRow=true;
					for(i = 0; i < arrayKeysLength; ++i) {
						
						if(aoa[r][i] == null){
							data[r][alphabetArray[i]] = ""
						}else{
							data[r][alphabetArray[i]] = aoa[r][i];
							checkBlankRow=false;
						}
							
					}
					if(!checkBlankRow){
						//emptyRowArray.push(r);
						dataArray.push(data[r]);
						
					}
				}
				
				$scope.inputData=JSON.parse(angular.toJson(dataArray));
				$scope.userInputData=JSON.parse(angular.toJson(dataArray));
				
				//if($scope.rawTableWithHeader.columnDefs.length == 0){
					$scope.rawTableWithHeader.columnDefs.push({
			  		      width:'5%',
			  		      name: 'ID',
					      field: '',
					      displayName: 'Row No.',
					      cellTemplate: '<span class="rowIndex">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</span>',
					      enableFiltering: false
			  		   });
					
					$.each(dataArray,function(key,val){
						length=getMaxLengthObj(val);
					});
					headerArray=alphabetArray.slice(0,length);
					$.each(headerArray,function(key,val){
			   		 $scope.rawTableWithHeader.columnDefs.push({
			   		     field: val,
			   		     width:'20%',
			   		     cellTooltip: true 
			   		      });
			   	});
			//	}
				$scope.rawTableWithHeader.data='inputData';
				//$scope.headersArray=data[0];
				$scope.headersArray=headerArray;
				 $scope.gridApi.grid.refresh();
				 $scope.gridApi.core.refresh();
			}
		
			$timeout(function(){
				if($scope.gridHeight >  $(".ui-grid-canvas").height()){
					angular.element(document.getElementsByClassName('grid1')[0]).css('height', $(".ui-grid-canvas").height()+90 + 'px');
				}
				else{
					angular.element(document.getElementsByClassName('grid1')[0]).css('height', $scope.gridHeight + 'px');
					
				}
				
			},100)
    	}
    	
    	
    	$scope.applyRules =function(){
    		forwardingArray=[];
    		if(!$('#outputFile').hasClass('in')){
				$("#output-file").click();	
			}
    		if($scope.fileHeader){
    	var header={};
		var finalArray=[];
		var columnMerge="";
		var temp={};
		
		if($scope.headStartIndex == $scope.headEndIndex){
			if(!(_.isEmpty($scope.myCountry.comparisonSelected)))
				temp['mergedColumns']='mergedColumns';
			$.each($scope.userInputData[$scope.headStartIndex-1],function(_i,res){
				temp[_i] = res == "" ? _i : res.replace(/[\r\n()]+/g, ' ');
				//temp[_i]=res;
			})
			 //finalArray.push($scope.userInputData[$scope.headStartIndex-1]);
			finalArray.push(temp);
		}
		else{
			if(!(_.isEmpty($scope.myCountry.comparisonSelected)))
				temp['mergedColumns']='mergedColumns';
			for(var j=$scope.headStartIndex-1;j<=$scope.headEndIndex-1;j++){
				
				$.each($scope.userInputData[j],function(_i,res){
					if(temp[_i] == undefined || temp[_i] == "")
					temp[_i] = res;
					else
						if(res == "")
						temp[_i] = temp[_i];	
						else
						temp[_i] = temp[_i] + '-' + res;
					
			});	
				
			}
			finalArray.push(temp);
		}
		
		$.each($scope.userInputData,function(i,val){
			temp={};
			if(i >= $scope.dataStartIndex-1){
				if(!(_.isEmpty($scope.myCountry.comparisonSelected)))
				temp['mergedColumns']="";
				
				$.each(val,function(_i,res){
					
					if(_.isEmpty($scope.myCountry.headerSelected) && _.isEmpty($scope.myCountry.comparisonSelected)){
					
						res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
						temp[finalArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
					}
					else{
						if(_.isEmpty($scope.myCountry.headerSelected)){
							angular.forEach($scope.myCountry.comparisonSelected, function(value, key) {
								if(_i == key && value == true){
									res=res.replace(/[\r\n]+/g, ' ');
									if(temp['mergedColumns'] == "" || temp['mergedColumns'] == undefined){
										temp['mergedColumns'] = res.replace(/[,]+/g, '-');
									}
									else{
										temp['mergedColumns'] = temp['mergedColumns'] + ' ' + res.replace(/[,]+/g, '-');	
									}
								}
							});
							res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
							temp[finalArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
						}
						else if(_.isEmpty($scope.myCountry.comparisonSelected))
							 {
								 angular.forEach($scope.myCountry.headerSelected, function(value, key) {
									if(_i == key && value == true){
										if(res == ""){
											//res=columnMerge;
											$.each(forwardingArray,function(key,val){
												if(val.key == _i)
												res=val.value;	
											})
										}
										else{
											columnMerge=res;
											forwardingArray.push({"key":_i,"value":res});
										}
									}
									res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
									temp[finalArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
								});
							 }
							 else{
								 angular.forEach($scope.myCountry.headerSelected, function(value, key) {
										if(_i == key && value == true){
											if(res == ""){
												//res=columnMerge;
												$.each(forwardingArray,function(key,val){
													if(val.key == _i)
													res=val.value;	
												})
											}
											else{
												columnMerge=res;
												forwardingArray.push({"key":_i,"value":res});
											}
										}
										res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
										temp[finalArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
									});
									angular.forEach($scope.myCountry.comparisonSelected, function(value, key) {
										if(_i == key && value == true){
											
											res=res.replace(/[\r\n]+/g, ' ');
											if(temp['mergedColumns'] == "" || temp['mergedColumns'] == undefined){
												temp['mergedColumns'] = res.replace(/[,]+/g, '-');
											}
											else{
												temp['mergedColumns'] = temp['mergedColumns'] + ' ' + res.replace(/[,]+/g, '-');	
											}
										/*angular.forEach($scope.myCountry.headerSelected, function(_value, _key) {
											if(_i  == _key && _value == true){
												if(res !== ""){
													tempStorage=res;
												}
												else{
													res=tempStorage;
												}
											}
											res=res.replace(/[\r\n]+/g, ' ');
											if(temp['mergedColumns'] == "" || temp['mergedColumns'] == undefined){
												temp['mergedColumns'] = res.replace(/[,]+/g, '-');
											}
											else{
												temp['mergedColumns'] = temp['mergedColumns'] + ' ' + res.replace(/[,]+/g, '-');	
											}
											
										});*/
										}
									});
							 }
					}
					
				});
				//console.log(temp);
				finalArray.push(temp);
			}
		});
//		console.log(JSON.stringify(finalArray));
		$scope.appliedInput.columnDefs=[];
		//if($scope.appliedInput.columnDefs.length == 0){
		$.each(finalArray[0],function(key,val){
		if(key == 'mergedColumns'){
		
			$scope.appliedInput.columnDefs.push({
	   		     field: val,
	   		     width:'20%',
	   		     cellTooltip: true,
	   		     displayName: 'Columns Merged For Comparison'
	   		      });
		}	
		else{
			$scope.appliedInput.columnDefs.push({
	   		     field: val,
	   		     width:'20%',
	   		     cellTooltip: true 
	   		      });
		}
    		}); 
		//}
		$scope.appliedData="";
		$scope.appliedInput.data='appliedData';
		$scope.appliedData=finalArray;
		$scope.appliedData.shift();
		$scope.appliedInput.data='appliedData';
		$scope.appliedTable=true;
    	}
    	else{
			actualArray=[];
			var temp={};
			temp['mergedColumns']='mergedColumns';
			$.each($scope.userInputData[0],function(i,val){
				temp[i]= i; 
			});
			actualArray.push(temp);
			//console.log(actualArray);
			$.each($scope.userInputData,function(i,val){
			    temp={};
				temp['mergedColumns']="";
							if(i >= $scope.dataStartIndex-1){
						$.each(val,function(_i,res){
							
							if(_.isEmpty($scope.myCountry.headerSelected) && _.isEmpty($scope.myCountry.comparisonSelected)){
							
								res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
								temp[actualArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
							}
							else{
								if(_.isEmpty($scope.myCountry.headerSelected)){
									angular.forEach($scope.myCountry.comparisonSelected, function(value, key) {
										if(_i == key && value == true){
											res=res.replace(/[\r\n]+/g, ' ');
											if(temp['mergedColumns'] == "" || temp['mergedColumns'] == undefined){
												temp['mergedColumns'] = res.replace(/[,]+/g, '-');
											}
											else{
												temp['mergedColumns'] = temp['mergedColumns'] + ' ' + res.replace(/[,]+/g, '-');	
											}
										}
									});
									res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
									temp[actualArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
								}
								else if(_.isEmpty($scope.myCountry.comparisonSelected))
									 {
										 angular.forEach($scope.myCountry.headerSelected, function(value, key) {
											if(_i == key && value == true){
												if(res == ""){
													//res=columnMerge;
													$.each(forwardingArray,function(key,val){
														if(val.key == _i)
														res=val.value;	
													})
												}
												else{
													columnMerge=res;
													forwardingArray.push({"key":_i,"value":res});
												}
											}
											res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
											temp[actualArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
										});
									 }
									 else{
										 angular.forEach($scope.myCountry.headerSelected, function(value, key) {
												if(_i == key && value == true){
													if(res == ""){
														//res=columnMerge;
														$.each(forwardingArray,function(key,val){
															if(val.key == _i)
															res=val.value;	
														})
													}
													else{
														columnMerge=res;
														forwardingArray.push({"key":_i,"value":res});
													}
												}
												res = res == "" ? "" : res.replace(/[\r\n]+/g, ' ');
												//temp[_i]=res.replace(/[,]+/g, '-');
												temp[actualArray[0][_i]]= res == "" ? "" : res.replace(/[,]+/g, '-');
											});
											angular.forEach($scope.myCountry.comparisonSelected, function(value, key) {
												if(_i == key && value == true){
													res=res.replace(/[\r\n]+/g, ' ');
													if(temp['mergedColumns'] == "" || temp['mergedColumns'] == undefined){
														temp['mergedColumns'] = res.replace(/[,]+/g, '-');
													}
													else{
														temp['mergedColumns'] = temp['mergedColumns'] + ' ' + res.replace(/[,]+/g, '-');	
													}
												/*angular.forEach($scope.myCountry.headerSelected, function(value, key) {
													if(_i  == key && value == true){
														if(res !== ""){
															tempStorage=res;
														}
														else{
															res=tempStorage;
														}
													}
													res=res.replace(/[\r\n]+/g, ' ');
													if(temp['mergedColumns'] == "" || temp['mergedColumns'] == undefined){
														temp['mergedColumns'] = res.replace(/[,]+/g, '-');
													}
													else{
														temp['mergedColumns'] = temp['mergedColumns'] + ' ' + res.replace(/[,]+/g, '-');	
													}
													
												});*/
												}
											});
									 }
							}
							
						});
						actualArray.push(temp);
						}
			
			
		});
			$scope.appliedInput.columnDefs=[];
				$.each(actualArray[0],function(key,val){
					if(key == 'mergedColumns'){
						
						$scope.appliedInput.columnDefs.push({
				   		     field: val,
				   		     width:'20%',
				   		     cellTooltip: true,
				   		     displayName: 'Columns Merged For Comparison'
				   		      });
					}	
					else{
						$scope.appliedInput.columnDefs.push({
				   		     field: key,
				   		     width:'20%',
				   		     cellTooltip: true 
				   		      });
					}
		   		 
		   		});
			
			//console.log(actualArray);
			$scope.appliedData="";
			$scope.appliedInput.data='appliedData';
			$scope.appliedData=actualArray;
			$scope.appliedData.shift();
			$scope.appliedInput.data='appliedData';
			$scope.appliedTable=true;
    	}
    		$scope.appliedInput.exporterCsvFilename=$scope.fileName.substring(0,$scope.fileName.lastIndexOf('.')) + ".csv";
    	}
    	
    	function download_csv(csv, filename) {
    	    var csvFile;
    	    var downloadLink;

    	    // CSV FILE
    	    csvFile = new Blob([csv], {type: "text/csv"});

    	    // Download link
    	    downloadLink = document.createElement("a");

    	    // File name
    	    downloadLink.download = filename;

    	    // We have to create a link to the file
    	    downloadLink.href = window.URL.createObjectURL(csvFile);

    	    // Make sure that the link is not displayed
    	    downloadLink.style.display = "none";

    	    // Add the link to your DOM
    	    document.body.appendChild(downloadLink);

    	    // Lanzamos
    	    downloadLink.click();
    	}

    	function export_table_to_csv(data, filename) {
    		var csv = [];
    		//var rows = document.querySelectorAll("#summary-table tr");
    		var rows=data;
    	    for (var i = 0; i < rows.length; i++) {
    	    	var row = [], cols = rows[i];
    				for (var k in cols) {
    	    	        row.push(cols[k]);
    	    	    }
    		 csv.push(row.join(","));		
    		}

    	    // Download CSV
    	    download_csv(csv.join("\n"), filename);
    	}
    	
    	/*document.getElementById('abc').addEventListener("click", function () {
    	    //console.log($scope.myCountry);
    		export_table_to_csv(actualArray, "table.csv");
    	});*/
    	
    	$scope.uploadTest=function(){
    		$.loader_show();
    		analyzeCoverageService.testUpload($scope.fileAdded).then(function(response){
    			$.loader_hide();
    			if(response.success)
    			window.open('/taxanomy/getEventMappingOutputFile?inputFileName='+$scope.fileAdded[0].name,"_self")
    			else
    			{
    				new PNotify({
    					title: 'Failed',
    					text: response.error,
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
    			
    		});
    	}
    	$scope.downloadTest=function(){
    		
    	}
    	
    	$('#user-upload').on('change',function(){
    		var $this=$(this);
    		var value=$(this).val();
    		var fileRegex = /^.*\.(csv)$/;
    		$scope.fileAdded=$('#user-upload')[0].files;
    		//console.log($scope.fileAdded);
    	});
    	
    	
    }]);
})();