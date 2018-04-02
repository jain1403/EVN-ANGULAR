(function() {
	'use strict';
	
	var app=angular.module("myApp");
	app.controller('toApmCtrl',['$scope','addAnalyticsService','$state','uiGridConstants','uiGridGroupingConstants','$filter','$timeout','$rootScope','NetworkCallService','csvService','analyticsPipelineService','$compile', function ($scope,addAnalyticsService,$state,uiGridConstants,uiGridGroupingConstants,$filter,$timeout,$rootScope,NetworkCallService,csvService,analyticsPipelineService,$compile) {
		$.loader_show();
		$scope.addDiv=true;
		$scope.updateDiv=true;
		$scope.validateExcel=true;
		$scope.validInput=true;
		$scope.numericValidation=true;
		$scope.analyticCheck=false;
		$scope.fromNerc=false;
		$scope.disableAnalytic=true;
		$scope.disableNerc=true;
		$('#nerc-submit').addClass('disable');
		$('#analytic-submit').addClass('disable');
		$rootScope.currentParent=$state.current.name;
		sessionStorage.setItem('currentPage',$state.current.name);
		$scope.showAdvnc=false;
		$scope.addUpate="Add";
		//$scope.searchHeader=" Search Result";
		$scope.update=false;
		$scope.clickfrmAdd=false;
		$scope.addUpdateForm=true;
		$scope.serachAccordian=false;
		$scope.serachCategory=false;
		$scope.coverageFlagValue="no";
		$('#add-analyitcs').addClass('bg-color');
		$scope.inUpdate=false;
		
		var regex = /^[^a-zA-Z0-9]+$/
			$(document).ready(

					function () {

						$("#fuelName").select2({
							placeholder: 'Select Fuel Type...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#fuelNameEBS").select2({
							placeholder: 'Select Fuel Type...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#assetName").select2({
							placeholder: 'Select Asset...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#systemName").select2({
							placeholder: 'Select System...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#subSystemName").select2({
							placeholder: 'Select Sub-System...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#compName").select2({
							placeholder: 'Select Component...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						/*$("#nercCode").select2({
							placeholder: 'Select Failure Code...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});*/
						$("#analyticSources").select2({
							placeholder: 'Select Analytic Source...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#analyticTechniques").select2({
							placeholder: 'Select Analytic Techniques...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#aws_status").select2({
							placeholder: 'Select AWS Status...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#analyticReadiness").select2({
							placeholder: 'Select Analytic Readiness...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
						$("#analyticPlatform").select2({
							placeholder: 'Select Analytic Platform...',
							minimumResultsForSearch: 4, 
							allowClear: true
						});
					});
		function resize(){
			//document.getElementById('addApmMainDiv').style.width=($(window).width()/1.8)+'px';
			//document.getElementById('addApmMainDiv').style.height=($(window).height()/1.8)+'px';
			//document.getElementById('addApmMainDiv').style.width=($('#collapseTwo').width()-15)+'px';
			//document.getElementById('addApmMainDiv').style.height=($(window).height()-64-43)+'px';
			document.getElementById('update-tab').style.height=($(window).height()-64-43)+'px';
			setTimeout(function(){
				var offset=$rootScope.isOpen?231:51;
				document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
				document.getElementById('mainView').style.height=($(window).height()-64)+'px';
				
				
			},400);}
		$(window).off('resize');
		$(window).on('resize',function() {
			resize();
		});
		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.toApm')
				resize();
		});
		$scope.fuelName=[];
		$scope.assetName=[];
		$scope.systemName=[];
		$scope.compName=[];
		$scope.nercCode=[];
		$scope.analyticApplication=[];
		$scope.analyticInputTag=[];
		$("#assetName").prop("disabled", true);
		$("#systemName").prop("disabled", true);
		$("#subSystemName").prop("disabled", true);
		$("#compName").prop("disabled", true);
		$scope.compIdSelected="0";

		function nercFunction(data){
			$scope.nercCode=[];
			_.forEach(data,function(data){
				var temp={};
				temp.failureId=data.failureId;
				temp.failureName=data.failureName;
				$scope.nercCode.push(temp);	
			});
		}
		$scope.userEntryDataCall=function(){
			if(sessionStorage.getItem('userEntryData')){
				var data=JSON.parse(sessionStorage.getItem('userEntryData')).body;
				analyticFunction(data);
				//setTimeout(function(){$('#addApmMainDiv').addClass('scroll-bar');},200);
			}
			else{
				var token=sessionStorage.getItem('token');
				addAnalyticsService.userEntryCall(token).then(function(data){
					if(data.body.data != undefined){
						if(data.body.data.error.refreshToken == true){
							var refreshToken=sessionStorage.getItem('refreshToken');
							NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
								sessionStorage.setItem('token',responceData.accessToken);
								$scope.userEntryDataCall();
								return;
							},function(error){
								alert('Unable to connect to the Services!');
							});
						}
					}
					else{
						sessionStorage.setItem('userEntryData',JSON.stringify(data));
					//	setTimeout(function(){$('#addApmMainDiv').addClass('scroll-bar');},200);
						data=data.body;
						analyticFunction(data);
						$.loader_hide();
					}

				},function(error){
					alert('Unable to connect to the Services!');
					$.loader_hide();
				});
			}
		}
		$scope.userEntryDataCall();
		function analyticFunction(data){
			$scope.analyticMainData=data;
			$scope.analyticPlatformData=data.analyticPlatform;
			$scope.analyticSources=data.analyticSources;
			$scope.analyticReadinessData=data.analyticReadiness;
			$scope.analyticTechniques=data.analyticTechniques;
			nercFunction(data.failureMasters);
			_.forEach(data.applicationMasters,function(data){
				var temp={};
				temp.id=data.id;
				temp.name=data.name;
				$scope.analyticApplication.push(temp);	
			});
			_.forEach(data.analyticInputTag,function(data){
				var temp={};
				temp.id=data.id;
				temp.name=data.name;
				$scope.analyticInputTag.push(temp);	
			});
			setTimeout(function(){
				$(".chosen-select").chosen();
				document.getElementById('leadTime').value="";
				document.getElementById('pod').value="";
				document.getElementById('fa').value="";
				$.loader_hide();
			},200);
		}
		$scope.assetLevelDataCall=function(){
			if(sessionStorage.getItem('assetLevelData')){
				var data=JSON.parse(sessionStorage.getItem('assetLevelData')).body;
				assetFunction(data);
			}
			else{
				var token=sessionStorage.getItem('token');
				addAnalyticsService.fuelTypeAndAssetCall(token).then(function(data){
					if(data.body.data != undefined){
						if(data.body.data.error.refreshToken == true){
							var refreshToken=sessionStorage.getItem('refreshToken');
							NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
								sessionStorage.setItem('token',responceData.accessToken);
								$scope.assetLevelDataCall();
								return;
							},function(error){
								alert('Unable to connect to the Services!');
							});
						}
					}
					else{
						sessionStorage.setItem('assetLevelData',JSON.stringify(data));
						data=data.body;
						assetFunction(data);
					}
				},function(error){
					alert('Unable to connect to the Services!');
					$.loader_hide();
				});
			}
		}
		$scope.assetLevelDataCall();		

		function assetFunction(data){
			$scope.assetMainData=data;
			_.forEach(data,function(data){
				var temp={};
				temp.id=data.fuelMasterId;
				temp.fuelName=data.fuelName;
				$scope.fuelName.push(temp);	
			});
		}

		function fuelReset(){

			$("#assetName").select2("val", "");
			$("#systemName").select2("val", "");
			$("#subSystemName").select2("val", "");
			$("#compName").select2("val", "");
			$("#assetName").prop("disabled", true);
			$("#subSystemName").prop("disabled", true);
			$("#compName").prop("disabled", true);
			$("#systemName").prop("disabled", true);
		}
		$scope.onChange=function(fuelName){
			fuelReset();
			var fuelName=document.getElementById('fuelName').value;
			$scope.fuelModelName=document.getElementById('fuelName').value;
			$scope.assetIdSelected="0";
			$scope.assetName=[];
			if(document.getElementById('fuelName').value != ""){
				$("#assetName").prop("disabled", false);
				$scope.assetName=_.map(_.filter($scope.assetMainData, {fuelName: fuelName}), 'assetData')[0];
			}
			$scope.$apply();	
		}
		$scope.onChangeEBS=function(fuelMasterId){
			console.log($scope.abc);
			$scope.fuelModelName=document.getElementById('fuelNameEBS').value;
		}
		function assetReset(){
			$("#systemName").select2("val", "");
			$("#subSystemName").select2("val", "");
			$("#compName").select2("val", "");
			$("#subSystemName").prop("disabled", true);
			$("#compName").prop("disabled", true);
			$("#systemName").prop("disabled", true);
		}
		$scope.systemLevelCall=function(assetId){
			var token=sessionStorage.getItem('token');
			addAnalyticsService.systemLevelCall(assetId,token).then(function(data){
				if(data.body.data != undefined){
					if(data.body.data.error.refreshToken == true){
						var refreshToken=sessionStorage.getItem('refreshToken');
						NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
							sessionStorage.setItem('token',responceData.accessToken);
							$scope.systemLevelCall();
							return;
						},function(error){
							alert('Unable to connect to the Services!');
						});
					}
				}
				else{
					data=data.body;
					$scope.systemMainData=data;
					$scope.systemName=[];

					_.forEach(data,function(data){
						var temp={};
						temp.sysMasterId=data.sysMasterId;
						temp.systemName=data.systemName;
						$scope.systemName.push(temp);
					});
					$("#systemName").prop("disabled", false);
					$.loader_hide();
				}

			},function(error){
				alert('Unable to connect to the Services!');
				$.loader_hide();
			});

		}

		$scope.onChangeAsset=function(assetId){
			assetReset();
			 $scope.assetId=document.getElementById('assetName').value;
			if(document.getElementById('assetName').value != ""){
				$.loader_show();
				$scope.systemLevelCall($scope.assetId);	
			}
		}
		function systemReset(){
			$("#subSystemName").select2("val", "");
			$("#compName").select2("val", "");
			$("#compName").prop("disabled", true);
			$("#subSystemName").prop("disabled", true);
		}
		$scope.onChangeSystem=function(systemId){
			systemReset();
			var systemId=document.getElementById('systemName').value;
			$scope.subSystemName=[];
			if(document.getElementById('systemName').value != ""){
				$("#subSystemName").prop("disabled", false);
				$scope.subSystemName=_.map(_.filter($scope.systemMainData, {sysMasterId: systemId}), 'subsysData')[0];
			}
			$scope.$apply();	
		}

		$scope.componentLevelCall=function(subSystemIdSelected){
			var token=sessionStorage.getItem('token');
			addAnalyticsService.componentLevelCall(subSystemIdSelected,token).then(function(data){
				if(data.body.data != undefined){
					if(data.body.data.error.refreshToken == true){
						var refreshToken=sessionStorage.getItem('refreshToken');
						NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
							sessionStorage.setItem('token',responceData.accessToken);
							$scope.componentLevelCall();
							return;
						},function(error){
							alert('Unable to connect to the Services!');
						});
					}
				}
				else{
					data=data.body;
					$scope.compMainData=data;
					$scope.compName=[];
					_.forEach(data.component,function(data){
						var temp={};
						temp.CompMasterId=data.CompMasterId;
						temp.CompName=data.CompName;
						$scope.compName.push(temp);	
					});
					$.loader_hide();
				}

			},function(error){
				alert('Unable to connect to the Services!');
				$.loader_hide();
			});

		}
		$scope.onChangeSubSystem=function(subSystemIdSelected){
			var subSystemIdSelected=document.getElementById('subSystemName').value;

			$("#compName").prop("disabled", false);
			$scope.compIdSelected="0";

			if(document.getElementById('subSystemName').value != ""){
				$.loader_show();
				$scope.componentLevelCall(subSystemIdSelected);
			}
			else{
				$("#compName").select2("val", "");
				$("#compName").prop("disabled", true);
			}
		}

		$scope.onChangecomp=function(compIdSelected){
			$scope.compIdSelected=document.getElementById('compName').value;
		}

		/*$scope.onChangenercCode=function(nercCodeSelected){
			$scope.nercCodeSelected=(document.getElementById('nercCode').value).split(/-(.+)/)[0];
		}*/
		function resetFunction(){
			document.getElementById('analyticName').value="";
			document.getElementById('bluePrintName').value="";
			document.getElementById('analyticCatalog').value="";
			document.getElementById('analyticDes').value="";
			document.getElementById('analyticOwner').value="";
			document.getElementById('analyticDocName').value="";
			document.getElementById('applicationDes').value="";
			//document.getElementById('rpn').value="";
			document.getElementById('leadTime').value='';
			document.getElementById('analyticOutcome').value="";
			document.getElementById('pod').value='';
			document.getElementById('fa').value='';
			document.getElementById('remark').value="";
			document.getElementById('nercCauseCodeField').value="";
			$scope.showAdvnc=false;
			$("#fuelName").select2("val", "");
			$("#fuelNameEBS").select2("val", "");
			$("#assetName").select2("val", "");
			$("#systemName").select2("val", "");
			$("#subSystemName").select2("val", "");
			$("#compName").select2("val", "");
			//$("#nercCode").select2("val", "");
			$("#analyticSources").select2("val", "");
			$("#analyticTechniques").select2("val", "");
			$("#aws_status").select2("val", "");
			$("#analyticReadiness").select2("val", "");
			$("#analyticPlatform").select2("val", "");
			//$('input[name="coverageFlagAPM"]').prop('checked', false);
			$scope.coverageFlagValue="no";
			$scope.prdeixReadinessValue="";
			$("#inputTag").val('').trigger("chosen:updated");
			$("#analyticApplication").val('').trigger("chosen:updated");
			$("#nercCode").val('').trigger("chosen:updated");
			
			$("#assetName").prop("disabled", true);
			$("#systemName").prop("disabled", true);
			$("#subSystemName").prop("disabled", true);
			$("#compName").prop("disabled", true);

		}
		function isInteger(x) { return (x^0) === x; } ;
		$scope.resetData=function(){
			resetFunction();
		}

		$scope.columns= [
		                 { name:'analyticName',displayName: 'Analytic Name',cellTooltip: true },
		                 { name:'analyticStatus',displayName: 'Status',cellTooltip: true },
		                 ];

		$scope.columnVisibility=false;
		$scope.successBox = {
				enableGridMenu: false,
				enableFiltering: true,
				data:'successData',
				columnDefs : $scope.columns,
				enableColumnResizing: true
		};
		$scope.failure = {
				enableGridMenu: false,
				enableFiltering: true,
				data:'failureData',
				columnDefs : $scope.columns,
				enableColumnResizing: true
		};


		$scope.getTableHeight = function() {
			var rowHeight = 40; // your row height
			var headerHeight = 40; // your header height
			if($scope.successData.length == 0){
				$scope.successDiv=false;
			}
			else{
				$scope.successDiv=true;
				if($scope.successData.length == 1){
					var successHeight= 1.5 * rowHeight + headerHeight

				}
				else{
					var successHeight=$scope.successData.length * rowHeight + headerHeight
				}
			}
			if($scope.failureData.length == 0){
				$scope.failureDiv=false;
			}
			else{
				$scope.failureDiv=true;
				if($scope.failureData.length == 1){
					var failureHeight=1.5 * rowHeight + headerHeight

				}
				else{
					var failureHeight=$scope.failureData.length * rowHeight + headerHeight
				}
			}
			
			$('.success').height(successHeight);
			$('.failure').height(failureHeight);
			

		};
		$scope.getSuggestionHeight = function(from) {
			var rowHeight = 30; // your row height
			var headerHeight = 55; // your header height
			if($scope.gridOptions.data.length == 1){
				var suggestionHeight=2 * rowHeight + headerHeight

			}
			else{
				var suggestionHeight=($scope.gridOptions.data.length+1) * rowHeight + headerHeight
			}
			if(suggestionHeight >= ($(window).height()/2)){
				
					$('#suggestion-update').height(($(window).height()/2)-30);	
			}
			else{
					$('#suggestion-update').height(suggestionHeight);
			}
		}
		function singleUpload(data){
			$.loader_hide();
			$.each(data,function(i,val){
				$.each(val,function(analyticName,res){
					var faultMessage="";
					var temp={};
					$.each(res,function(_i,_res){
						if(_res.statusMessage !== 'Success'){
							$scope.insertError=true;
							$scope.faultAnalyticName=analyticName;
							if(faultMessage != ""){									
								faultMessage=faultMessage+','+_res.statusMessage;
							}
							else{
								faultMessage=_res.statusMessage;
							}

						}else{
							new PNotify({
								title: 'Success!',
								text: analyticName+'Added Successfully',
								type: 'success',

								buttons: {
									classes: {
										closer: 'fa fa-close',
										pin_up: '',
										pin_down: ''
									}
								}
							});
						}
						$scope.analyticCheck=false;
						$scope.nercCheck=false;
						$('#analyticNameDiv').removeClass('pd-bt');
						
					})
					if($scope.insertError){
						new PNotify({
							title: 'Failed',
							text: faultMessage,
							type: 'error',
							buttons: {
								classes: {
									closer: 'fa fa-close',
									pin_up: '',
									pin_down: ''
								}
							}
						});
						$scope.analyticCheck=false;
						$scope.nercCheck=false;
						$('#analyticNameDiv').removeClass('pd-bt');
						$scope.insertError=false;
					}
					else{
						resetFunction();
					}
				})
			});  

		}	    

		function bulkUpload(data){
			var responseStatusSuccess=[];
			var responseStatusFailure=[];
			
			$.each(data,function(i,val){
				$.each(val,function(analyticName,res){
					var faultMessage="";
					var success={};
					var failure={};
					$.each(res,function(_i,_res){
						if(_res.statusMessage !== 'Success'){
							failure.analyticName=analyticName;
							if(faultMessage != ""){									
								faultMessage=faultMessage+','+_res.statusMessage;
							}
							else{
								faultMessage=_res.statusMessage;
							}
							failure.analyticStatus=faultMessage;

						}else{
							success.analyticName=analyticName;
							success.analyticStatus=faultMessage+_res.statusMessage;

						}
					})
					if(!(jQuery.isEmptyObject(success)))
						responseStatusSuccess.push(success);
					if(!(jQuery.isEmptyObject(failure)))
						responseStatusFailure.push(failure);
				})
			});  
			$scope.successData=responseStatusSuccess;
			$scope.failureData=responseStatusFailure;
			$scope.getTableHeight();
			console.log(responseStatusSuccess);
			console.log(responseStatusFailure);
			$('#apmModal').modal('show');
			$.loader_hide();
		}
		$scope.analyticSubmitCall=function(singleUploaddata){
			var token=sessionStorage.getItem('token');
			if($scope.update){
				var data={};
				$scope.afterUpdate=true;
				data['newData']=singleUploaddata.analytics[0];
				data['oldData']=$scope.oldData;
				console.log(JSON.stringify(data));
				addAnalyticsService.updateAnalyticCall(data,"updateAnalytics").then(function(data){
					$.loader_hide();
					if(data.statusMessage == "Success"){
						new PNotify({
							title: 'Success',
							text: 'Analytics Updated Successfully',
							type: 'success',
							buttons: {
								classes: {
									closer: 'fa fa-close',
									pin_up: '',
									pin_down: ''
								}
							}
						});
						resetFunction();
						$scope.update=false;
						$scope.afterUpdate=true;
						$scope.addUpdateForm=false;
						if(document.getElementById('analyticNameSearch').value != "" && document.getElementById('analyticNameSearch').value != undefined){
						$scope.getSuggestion('AnalyticsName',document.getElementById('analyticNameSearch').value,'analytic','update');	
						}
						else{
							if(document.getElementById('nercSearch').value != "" && document.getElementById('nercSearch').value != undefined){
								$scope.getSuggestion('NERCCauseCode',document.getElementById('nercSearch').value,'analytic','update');
							}
						}
						if(!$('#collapseOne').hasClass('in')){
							$("#search-criteria").click();	
						}
					}
					else{
						new PNotify({
							title: 'Error',
							text: data.statusMessage,
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
					
				},function(error){
					alert('Unable to connect to the Services!');
					$.loader_hide();
				});
			}
			else{
			addAnalyticsService.saveAnalyticCall(singleUploaddata,token).then(function(data){
				if(data.body != undefined){
					if(data.body.data.error.refreshToken == true){
						var refreshToken=sessionStorage.getItem('refreshToken');
						NetworkCallService.getAccessToken(refreshToken).then(function(responceData){
							sessionStorage.setItem('token',responceData.accessToken);
							$scope.analyticSubmitCall();
							return;
						},function(error){
							alert('Unable to connect to the Services!');
						});
					}
				}
				else{
					if(singleUploaddata.analytics.length > 1)
					{
						bulkUpload(data);
					}
					else{
						singleUpload(data);
					}
					$scope.analyticCheck=false;
					$scope.fromNerc=false;
					angular.forEach(sessionStorage, function (item,key) {
						if(!(key == 'SSO' || key == 'loggedIn' || key == 'refreshToken' || key == 'token' || key == 'userDetails' || key == 'currentPage'))
						{
							sessionStorage.removeItem(key);	
						}
					});
				}
				$scope.analyticCheck=false;
				$scope.afterUpdate=true;
				if(document.getElementById('analyticNameSearch').value != "" && document.getElementById('analyticNameSearch').value != undefined){
				$scope.getSuggestion('AnalyticsName',document.getElementById('analyticNameSearch').value,'analytic','update');	
				}
				else{
					if(document.getElementById('nercSearch').value != "" && document.getElementById('nercSearch').value != undefined){
						$scope.getSuggestion('NERCCauseCode',document.getElementById('nercSearch').value,'analytic','update');
					}
				}
				if(!$('#collapseOne').hasClass('in')){
					$("#search-criteria").click();	
				}
			},function(error){
				$scope.analyticCheck=false;
				alert('Unable to connect to the Services!');
				$.loader_hide();
			});
		 }
		}
		
		function check(){

			if(!isInteger(Number(document.getElementById('fa').value)) == true || !isInteger(Number(document.getElementById('leadTime').value)) == true || !isInteger(Number(document.getElementById('pod').value)) == true || !isInteger(Number(document.getElementById('nercCauseCodeField').value)) == true){
				if(!isInteger(Number(document.getElementById('fa').value)) == true){
					document.getElementById("fa").focus();
					$('#fa').addClass('border-red');
				}
				if(!isInteger(Number(document.getElementById('leadTime').value)) == true){
					document.getElementById("leadTime").focus();
					$('#leadTime').addClass('border-red');
				}
				if(!isInteger(Number(document.getElementById('pod').value)) == true){
					document.getElementById("pod").focus();
					$('#pod').addClass('border-red');
				}
				if(!isInteger(Number(document.getElementById('nercCauseCodeField').value)) == true){
					document.getElementById("nercCauseCodeField").focus();
					$('#nercCauseCodeField').addClass('border-red');
				}
				new PNotify({
					title: 'Wrong Input',
					text: 'Enter Number Only',
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
				$.loader_show();
				$scope.submitData={};
				if(document.getElementById('analyticName').value == "" || document.getElementById('analyticName').value == undefined){
					$scope.submitData.analyticName=null;	
				}
				else{
					$scope.submitData.analyticName=document.getElementById('analyticName').value;	
				}
				if($scope.showAdvnc){
					if(document.getElementById('fuelName').value == "" || document.getElementById('fuelName').value == undefined){
						$scope.submitData.fuelName=""
					}
					else{
						$scope.submitData.fuelName=document.getElementById('fuelName').value;
					}
				}
				else{
					if(document.getElementById('fuelNameEBS').value == "" || document.getElementById('fuelNameEBS').value == undefined){
						$scope.submitData.fuelName=""
					}
					else{
						$scope.submitData.fuelName=document.getElementById('fuelNameEBS').value;
					}
				}
				if(document.getElementById('assetName').value == "" || document.getElementById('assetName').value == undefined){
					$scope.submitData.assetId=null;	
				}
				else{
					$scope.submitData.assetId=parseInt(document.getElementById('assetName').value);
				}
				if(document.getElementById('systemName').value == "" || document.getElementById('systemName').value == undefined){
					$scope.submitData.systemId=null;	
				}
				else{
					$scope.submitData.systemId=parseInt(document.getElementById('systemName').value);
				}
				if(document.getElementById('subSystemName').value == "" || document.getElementById('subSystemName').value == undefined){
					$scope.submitData.subSystemId=null;	
				}
				else{
					$scope.submitData.subSystemId=parseInt(document.getElementById('subSystemName').value);
				}
				if(document.getElementById('bluePrintName').value == "" || document.getElementById('bluePrintName').value == undefined){
					$scope.submitData.bluePrintName=null;	
				}
				else{
					$scope.submitData.bluePrintName=document.getElementById('bluePrintName').value;
				}
				if(document.getElementById('analyticCatalog').value == "" || document.getElementById('analyticCatalog').value == undefined){
					$scope.submitData.analyticCatalog=null;	
				}
				else{
					$scope.submitData.analyticCatalog=document.getElementById('analyticCatalog').value;
				}
				if(document.getElementById('analyticDes').value == "" || document.getElementById('analyticDes').value == undefined){
					$scope.submitData.analyticDes=null;	
				}
				else{
					$scope.submitData.analyticDes=document.getElementById('analyticDes').value;
				}
				if(document.getElementById('analyticOwner').value == "" || document.getElementById('analyticOwner').value == undefined){
					$scope.submitData.analyticOwner=null;	
				}
				else{
					$scope.submitData.analyticOwner=document.getElementById('analyticOwner').value;
				}
				if(document.getElementById('analyticDocName').value == "" || document.getElementById('analyticDocName').value == undefined){
					$scope.submitData.analyticDocName=null;	
				}
				else{
					$scope.submitData.analyticDocName=document.getElementById('analyticDocName').value;
				}
				if(document.getElementById('applicationDes').value == "" || document.getElementById('applicationDes').value == undefined){
					$scope.submitData.applicationDes=null;	
				}
				else{
					$scope.submitData.applicationDes=document.getElementById('applicationDes').value;
				}
				/*if(document.getElementById('rpn').value == "" || document.getElementById('rpn').value == undefined){
					$scope.submitData.rpn=null;	
				}
				else{
					$scope.submitData.rpn=document.getElementById('rpn').value;
				}*/
				if(document.getElementById('leadTime').value == "" || document.getElementById('leadTime').value == undefined){
					$scope.submitData.leadTime=null;	
				}
				else{
					$scope.submitData.leadTime=parseInt(document.getElementById('leadTime').value);
				}
				if(document.getElementById('analyticOutcome').value == "" || document.getElementById('analyticOutcome').value == undefined){
					$scope.submitData.analyticOutcome=null;	
				}
				else{
					$scope.submitData.analyticOutcome=document.getElementById('analyticOutcome').value;
				}
				
				if(document.getElementById('pod').value == "" || document.getElementById('pod').value == undefined){
					$scope.submitData.pod=null;	
				}
				else{
					$scope.submitData.pod=parseInt(document.getElementById('pod').value);
				}
				if(document.getElementById('fa').value == "" || document.getElementById('fa').value == undefined){
					$scope.submitData.fa=null;	
				}
				else{
					$scope.submitData.fa=parseInt(document.getElementById('fa').value);
				}
				if(document.getElementById('remark').value == "" || document.getElementById('remark').value == undefined){
					$scope.submitData.remark=null;	
				}
				else{
					$scope.submitData.remark=document.getElementById('remark').value;
				}
				if(document.getElementById('nercCauseCodeField').value == "" || document.getElementById('nercCauseCodeField').value == undefined){
					$scope.submitData.nercCauseCode=null;	
				}
				else{
					$scope.submitData.nercCauseCode=parseInt(document.getElementById('nercCauseCodeField').value);
				}
				if(document.getElementById('analyticSources').value == "" || document.getElementById('analyticSources').value == undefined){
					$scope.submitData.analyticSources=null;	
				}
				else{
					$scope.submitData.analyticSources=document.getElementById('analyticSources').value;
				}
				if(document.getElementById('analyticPlatform').value == "" || document.getElementById('analyticPlatform').value == undefined){
					$scope.submitData.analyticPlatform=null;	
				}
				else{
					$scope.submitData.analyticPlatform=document.getElementById('analyticPlatform').value;
				}
				if(document.getElementById('analyticTechniques').value == "" || document.getElementById('analyticTechniques').value == undefined){
					$scope.submitData.analyticTechniques=null;	
				}
				else{
					$scope.submitData.analyticTechniques=document.getElementById('analyticTechniques').value;
				}
				if(document.getElementById('analyticReadiness').value == "" || document.getElementById('analyticReadiness').value == undefined){
					$scope.submitData.analyticReadiness=null;	
				}
				else{
					$scope.submitData.analyticReadiness=document.getElementById('analyticReadiness').value;
				}
				if(document.getElementById('aws_status').value == "" || document.getElementById('aws_status').value == undefined){
					$scope.submitData.awsStatus=null;	
				}
				else{
					$scope.submitData.awsStatus=document.getElementById('aws_status').value;
				}
				if(document.querySelector('input[name="prdeixReadiness"]:checked') != null){
					$scope.submitData.prdeixReadiness=document.querySelector('input[name="prdeixReadiness"]:checked').value;
				}
				else{
					$scope.submitData.prdeixReadiness="";
				}
				if(document.querySelector('input[name="coverageFlagAPM"]:checked') != null){
					$scope.submitData.coverageFlag=document.querySelector('input[name="coverageFlagAPM"]:checked').value;
				}
				else{
					$scope.submitData.coverageFlag=null;
				}
				
				if(($("#inputTag").chosen().val()).filter(String).join() == "" || ($("#inputTag").chosen().val()).filter(String).join() == undefined){
					$scope.submitData.inputTag="";	
				}
				else{
					$scope.submitData.inputTag=($("#inputTag").chosen().val()).filter(String).join();
				}
				if(($("#analyticApplication").chosen().val()).filter(String).join() == "" || ($("#analyticApplication").chosen().val()).filter(String).join() == undefined){
					$scope.submitData.analyticApplication="";	
				}
				else{
					$scope.submitData.analyticApplication=($("#analyticApplication").chosen().val()).filter(String).join();
				}
				/*if($scope.compIdSelected == "0"){
					$scope.submitData.compIdSelected=null;
				}
				else{
					$scope.submitData.compIdSelected=parseInt($scope.compIdSelected);
				}*/
				if(document.getElementById('compName').value == "" || document.getElementById('compName').value == undefined){
					$scope.submitData.compIdSelected=null;	
				}
				else{
					$scope.submitData.compIdSelected=document.getElementById('compName').value;
				}
				if(($("#nercCode").chosen().val()).filter(String).join() == "" || ($("#nercCode").chosen().val()).filter(String).join() == undefined){
					$scope.submitData.failureCode="";	
				}
				else{
					$scope.submitData.failureCode=($("#nercCode").chosen().val()).filter(String).join();
				}
				/*if(document.getElementById('nercCode').value == "" || document.getElementById('nercCode').value == undefined){
					$scope.submitData.failureName=null;	
				}
				else{
					$scope.submitData.failureName=(document.getElementById('nercCode').value).split(/-(.+)/)[0];
				}*/
				var singleUploaddata={};
				singleUploaddata['analytics']=[];
				singleUploaddata['analytics'].push($scope.submitData);
				console.log(JSON.stringify(singleUploaddata));
				//$.loader_hide();
				$scope.analyticSubmitCall(singleUploaddata);
			}

		}
		
		
		$('.validationField').bind("change", function(data){
				if(document.getElementById(data.target.id).value.match(regex) != null){
					$('#'+data.target.id).addClass('border-red');
					document.getElementById(data.target.id).focus();
					new PNotify({
						title: 'Invalid Input ',
						text: 'Please enter Valid Input',
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
					$('#'+data.target.id).removeClass('border-red');
					
				}
			});
		
		$('.numberValidation').bind("change", function(data){
			if(!(isInteger(Number(document.getElementById(data.target.id).value)) == true)){
				$('#'+data.target.id).addClass('border-red');
				document.getElementById(data.target.id).focus();
				new PNotify({
					title: 'Invalid Input ',
					text: 'Please Enter Number Only',
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
				$('#'+data.target.id).removeClass('border-red');
				
			}
		});
		
		function checkSpecialCharOnly(){
			var testpass=true;
			$.each( $(".validationField"), function(index, ele){
				if(document.getElementById(ele.id).value.match(regex) != null){
					$('#'+ele.id).addClass('border-red');
					document.getElementById(ele.id).focus();
					testpass=false;
					new PNotify({
						title: 'Invalid Input ',
						text: 'Please enter Valid Input',
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
			if(testpass)
				check();
		}
		$scope.analyticSubmit=function(){

			if($scope.showAdvnc){

				if(document.getElementById('fuelName').value == "" || document.getElementById('assetName').value == "" || document.getElementById('systemName').value == "" || document.getElementById('subSystemName').value == "" || document.getElementById('compName').value == "" || document.getElementById('analyticPlatform').value == "" || document.getElementById('analyticSources').value == "" ||  document.getElementById('analyticReadiness').value == "" 
					||  $("#analyticApplication").chosen().val() == "" || document.getElementById('analyticName').value == ""  || document.getElementById('analyticOwner').value == ""  || document.getElementById('analyticDocName').value == "" 
						|| document.getElementById('analyticDes').value == ""){

					new PNotify({
						title: 'Required Field',
						text: 'Please fill the Mandatory fields',
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
					checkSpecialCharOnly();
				}
			}else{

				if(document.getElementById('nercCauseCodeField').value == "" || document.getElementById('fuelNameEBS').value == "" ||  document.getElementById('analyticPlatform').value == "" || document.getElementById('analyticSources').value == "" ||  document.getElementById('analyticReadiness').value == "" 
					||  $("#analyticApplication").chosen().val() == "" || document.getElementById('analyticName').value == ""  || document.getElementById('analyticOwner').value == ""  || document.getElementById('analyticDocName').value == "" 
						|| document.getElementById('analyticDes').value == ""){

					new PNotify({
						title: 'Required Field',
						text: 'Please fill the Mandatory fields',
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
					checkSpecialCharOnly();
				}
			}
		}

		$scope.checkNercCode=function(){
			if($scope.inUpdate){
				$scope.gridOptions.columnDefs[0].visible=true;	
			}
			else{
				$scope.gridOptions.columnDefs[0].visible=false;
				if(document.getElementById('nercCauseCodeField').value != "" && isInteger(Number(document.getElementById('nercCauseCodeField').value))){
					$('#nercCauseCodeField').addClass('loadinggif');
					$scope.fromNerc=true;
					$scope.getSuggestion('NERCCauseCode',document.getElementById('nercCauseCodeField').value,'analytic','add');
				}
				else{
					$scope.nercCheck=false;
				}
			}
		}
		$scope.checkAnalyticName=function(){
			if($scope.inUpdate){
				$scope.gridOptions.columnDefs[0].visible=true;	
			}
			else{
				$scope.gridOptions.columnDefs[0].visible=false;
				
			}
			if(document.getElementById('analyticName').value != "" && document.getElementById('analyticName').value.match(regex) == null){
				$('#analyticName').addClass('loadinggif');
				if($scope.inUpdate)
				$scope.fromSearch=false;	
				$scope.getSuggestion('AnalyticsName',document.getElementById('analyticName').value,'analytic','update');
			}
			else{
				$scope.analyticCheck=false;
			}
		}
		$scope.getSuggestion=function(name,data,type,from){
			if($scope.inUpdate && $scope.fromSearch){
					$.loader_show();
				}
			addAnalyticsService.getSuggestion(name,data,type).then(function(data){
				data=data.body;
				if(data.length >= 1){
				  for (var i in data) {
					   			
					  			if(data[i].coverage_flag != null)
						   		data[i].coverage_flag = data[i].coverage_flag.split(',')[0];
						   		if(data[i].tag_name != null)
							    data[i].tag_name=(_.uniq(data[i].tag_name.split(','))).toString();
							    if(data[i].app_name != null)
							    data[i].app_name=(_.uniq(data[i].app_name.split(','))).toString();
							    if(data[i].tag_name == null)
								data[i].tag_name="";
					   }
				if($scope.inUpdate){
					if($scope.fromSearch){
						$scope.showTable=true;
						$scope.showTableLabel=true;
						document.getElementById('searchLabel').innerHTML="Search Result";
						$('#searchLabel').removeClass('no-result');
						$.loader_hide();
						$scope.fromSearch=false;
						$scope.gridOptions.data=data;
						$scope.getSuggestionHeight(from);
					}
					else{
						if($scope.afterUpdate && $scope.afterUpdate != undefined){
							$scope.afterUpdate=false;
							$scope.gridOptions.data=data;
							$scope.getSuggestionHeight(from);
						}
						else{
							var match= _.filter(data, function(o) { 
							    return o.analytic_name == document.getElementById('analyticName').value; 
							 });
							if(match.length > 0){
								$scope.analyticCheck=true;
								$('#analyticNameDiv').addClass('pd-bt');
								$scope.gridOptions.data=data;
								$scope.getSuggestionHeight(from);
								document.getElementById('analyticNameSearch').value=document.getElementById('analyticName').value;
							}
							else{
								$scope.analyticCheck=false;
								$('#analyticNameDiv').removeClass('pd-bt');
							}
						}
						$('#analyticName').removeClass('loadinggif');
					}
				}else{
					if($scope.fromNerc && $scope.fromNerc != undefined){
						$scope.tempNercData=data;
						$scope.nercCheck=true;
						document.getElementById('nercSearch').value=document.getElementById('nercCauseCodeField').value;
						document.getElementById('analyticNameSearch').value="";
						$('#nercCauseCodeField').removeClass('loadinggif');
						$scope.fromNerc=false;
						$scope.searchHeader="Analytics found with NERC Code: <span class='searchTag'>"+ document.getElementById('nercCauseCodeField').value+"<span>";
						
					}else{
						$scope.tempAnalyticData=data;
						$scope.analyticCheck=true;
						$('#analyticNameDiv').addClass('pd-bt');
						document.getElementById('analyticNameSearch').value=document.getElementById('analyticName').value;
						document.getElementById('nercSearch').value="";
						$('#analyticName').removeClass('loadinggif');
						$scope.searchHeader="Analytics found with Analyitc Name: <span class='searchTag'>"+ document.getElementById('analyticName').value+"<span>";
					}
					
					$scope.gridOptions.data=data;
					$scope.getSuggestionHeight(from);
					$.loader_hide();
					}
				}
				else{
					if($scope.inUpdate){
						if($scope.fromSearch){
							$('#analyticNameDiv').addClass('pd-bt');
							$scope.showTable=false;
							$scope.showTableLabel=true;
							document.getElementById('searchLabel').innerHTML="No Result Found !!"
							$('#searchLabel').addClass('no-result');
							$.loader_hide();
						}
						else{
							$('#analyticName').removeClass('loadinggif');
							$scope.analyticCheck=false;
							$('#analyticNameDiv').removeClass('pd-bt');
						}
					}
					else{
						$('#analyticName').removeClass('loadinggif');
						$('#nercCauseCodeField').removeClass('loadinggif');
						$('#analyticNameDiv').removeClass('pd-bt');
						$scope.analyticCheck=false;
						$scope.nercCheck=false;
						$scope.serachAccordian=false;
						$scope.serachCategory=false;
						$scope.showTable=false;
						$scope.showTableLabel=false;
						$scope.fromNerc=false;
					}
					
				}
				},function(error){
					alert('Unable to connect to the Services!');
					$.loader_hide();
					$('#analyticName').removeClass('loadinggif');
					$('#nercCauseCodeField').removeClass('loadinggif');
				});
			
		}
		var removeTemplate = '<i title="Edit Analytics" class="fa fa-pencil-square-o editIcon" aria-hidden="true" ng-click="grid.appScope.edit(row)"></i>';
		  $scope.gridOptions = {
				  enableFiltering: true,
				  enableGridMenu: true,
				  enableColumnResizing: true
		  };
		  $scope.edit = function(row) {
			  $scope.update=true;
			  $scope.analyticCheck=false;
			  //	$scope.addUpate="Update";
			  //$('#mainHeader').addClass('pad');
			  /*$timeout(function(){
	        		$('#add-analyitcs').removeClass('bg-color');
					$('#update-analyitcs').addClass('bg-color');	
	        	},0);*/
			  $scope.oldData=row.entity;
			  console.log(row.entity);
			 /* if(row.entity.fuelName == undefined || row.entity.fuelName == null)
			  {
				  document.getElementById('fuelNameEBS').value="";
			  }
			  else{
				  document.getElementById('fuelNameEBS').value=row.entity.fuelName;
			  }
			  if(row.entity.fuelName == undefined || row.entity.fuelName == null)
			  {
				  document.getElementById('fuelName').value="";
			  }
			  else{
				  document.getElementById('fuelName').value=row.entity.fuelName;
			  }*/
			  if(row.entity.analytic_name == undefined || row.entity.analytic_name == null)
			  {
				  document.getElementById('analyticName').value="";
			  }
			  else{
				  document.getElementById('analyticName').value=row.entity.analytic_name;
			  }
			  if(row.entity.asset_blueprint == undefined || row.entity.asset_blueprint == null)
			  {
				  document.getElementById('bluePrintName').value="";
			  }
			  else{
				  document.getElementById('bluePrintName').value=row.entity.asset_blueprint;
			  }
			  if(row.entity.catalog_analytic_name == undefined || row.entity.catalog_analytic_name == null)
			  {
				  document.getElementById('analyticCatalog').value="";
			  }
			  else{
				  document.getElementById('analyticCatalog').value=row.entity.catalog_analytic_name;
			  }
			  if(row.entity.analytic_description == undefined || row.entity.analytic_description == null)
			  {
				  document.getElementById('analyticDes').value="";
			  }
			  else{
				  document.getElementById('analyticDes').value=row.entity.analytic_description;
			  }
			  if(row.entity.analytic_owner == undefined || row.entity.analytic_owner == null)
			  {
				  document.getElementById('analyticOwner').value="";
			  }
			  else{
				  document.getElementById('analyticOwner').value=row.entity.analytic_owner;
			  }
			  if(row.entity.analytic_technical_document_link == undefined || row.entity.analytic_technical_document_link == null)
			  {
				  document.getElementById('analyticDocName').value="";
			  }
			  else{
				  document.getElementById('analyticDocName').value=row.entity.analytic_technical_document_link;
			  }
			  if(row.entity.lead_time_days == undefined || row.entity.lead_time_days == null)
			  {
				  document.getElementById('leadTime').value="";
			  }
			  else{
				  document.getElementById('leadTime').value=row.entity.lead_time_days;
			  }
			  if(row.entity.applDesc == undefined || row.entity.applDesc == null)
			  {
				  document.getElementById('applicationDes').value="";
			  }
			  else{
				  document.getElementById('applicationDes').value=row.entity.applDesc;
			  }
			  if(row.entity.analytic_outcome == undefined || row.entity.analytic_outcome == null)
			  {
				  document.getElementById('analyticOutcome').value="";
			  }
			  else{
				  document.getElementById('analyticOutcome').value=row.entity.analytic_outcome;
			  }
			  if(row.entity.pod_percent == undefined || row.entity.pod_percent == null)
			  {
				  document.getElementById('pod').value="";
			  }
			  else{
				  document.getElementById('pod').value=row.entity.pod_percent;
			  }
			  if(row.entity.far_percent == undefined || row.entity.far_percent == null)
			  {
				  document.getElementById('fa').value="";
			  }
			  else{
				  document.getElementById('fa').value=row.entity.far_percent;
			  }
			  if(row.entity.nerc_cause_code == undefined || row.entity.nerc_cause_code == null)
			  {
				  document.getElementById('nercCauseCodeField').value="";
			  }
			  else{
				  document.getElementById('nercCauseCodeField').value=row.entity.nerc_cause_code;
			  }
			  if(row.entity.comment == undefined || row.entity.comment == null)
			  {
				  document.getElementById('remark').value="";
			  }
			  else{
				  document.getElementById('remark').value=row.entity.comment;
			  }
			  $("#analyticPlatform").select2("val", row.entity.analytic_platform);
			  $("#fuelNameEBS").select2("val", row.entity.fuelName);
			  $("#fuelName").select2("val", row.entity.fuelName);
			  $("#analyticSources").select2("val",row.entity.analytic_source);
			  $("#analyticReadiness").select2("val",row.entity.analytic_readiness);
			  $("#analyticTechniques").select2("val", row.entity.analytic_techniques);
			  if(row.entity.aws_readiness == null)
			  {
				  $("#aws_status").select2("val", 'Not Started');	
			  }
			  if(row.entity.aws_readiness == "0")
			  {
				  $("#aws_status").select2("val", 'In Progress');
			  }
			  if(row.entity.aws_readiness == "1")
			  {
				  $("#aws_status").select2("val", 'Completed');
			  }
			  if(row.entity.coverage_items_flag == "0"){
				  $scope.coverageFlagValue="no";
			  }
			  else{
				  $scope.coverageFlagValue="yes";
			  }
			  if(row.entity.predix_readiness == "0"){
				  $scope.prdeixReadinessValue="no";
			  }
			  else{
				  $scope.prdeixReadinessValue="yes";
			  }
			  if(row.entity.failureName != null)
				  $("#nercCode").val(row.entity.failureCode.split(',')).trigger("chosen:updated");
			  if(row.entity.app_name != null)
				  $("#analyticApplication").val(row.entity.app_name.split(',')).trigger("chosen:updated");
			  if(row.entity.tag_name != null)
				  $("#inputTag").val(row.entity.tag_name.split(',')).trigger("chosen:updated");
			  //$("#nercCode").select2("val",row.entity.failureName);
			  $('#analyticSuggestion').modal('hide');
			  setTimeout(function(){
				  $scope.$apply();	
			  },0);
			  if($scope.inUpdate){
				  $scope.addUpdateForm=true;
				  //$scope.addDiv=true;
				  //$scope.updateDiv=true;
				  //$('#mainHeader').addClass('txt-center');
				  if($('#collapseOne').hasClass('in')){
					  $("#search-criteria").click();
				  }
				  if(!$('#collapseTwo').hasClass('in')){
					  $("#search-result").click();
				  }
			  }


		  };
			$scope.gridOptions.columnDefs = [
				{
					name: 'Edit',
					cellTemplate: removeTemplate,
					enableFiltering: false,
					enableColumnMenu: false,
					width:'5%',
					cellTooltip: true,
					displayName:'Edit',
					visible: true
				},                           
				{
					name: 'analytic_name',
					displayName: 'Analytic Name',
					width:'20%',
					cellTooltip: true
				},
				{
					name: 'analytic_description',
					displayName: 'Analytic Description',width:'20%',cellTooltip: true},
				{
					name: 'analytic_platform',
					displayName:'Analytic Platform',width:'20%',cellTooltip: true},
				{
						name: 'nerc_cause_code',
						displayName:'NERC Cause Code',width:'20%',cellTooltip: true
				},
				{
					name: 'analytic_source',
					displayName: 'Analytic Source',width:'20%',cellTooltip: true},
				{
					name: 'asset_blueprint',
					displayName: 'Blueprint Name',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'catalog_analytic_name',
					displayName: 'Analytic Catalog Name',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'analytic_owner',
					displayName: 'Analytic Owner',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'analytic_technical_document_link',
					displayName: 'Analytic Document Link',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'lead_time_days',
					displayName: 'Lead Time',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'analytic_outcome',
					displayName: 'Analytic Outcome',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'pod_percent',
					displayName: 'PoD',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'far_percent',
					displayName: 'FA',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'analytic_readiness',
					displayName: 'Analytic Readiness',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'analytic_techniques',
					displayName: 'Analytic Techniques',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'failureName',
					displayName: 'Failure Name',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'coverage_items_flag',
					displayName: 'Coverage Flag',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'predix_readiness',
					displayName: 'Predix Readiness',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'app_name',
					displayName: 'Application Name',width:'20%',cellTooltip: true,visible: false},
				{
					name: 'tag_name',
					displayName: 'Input Tag Name',width:'20%',cellTooltip: true,visible: false}
				];
		$scope.downloadTemp=function(){
			csvService.downloadTemplate().then(function(data){
			},function(error){
				alert('Unable to Find the Template!');
				$.loader_hide();
			});
		}
		$scope.uploadCsv=function(){
			$('#csv-file').click();
		}

		var keys=["fuelName","nercCauseCode","failureCode","analyticApplication","inputTag","analyticName","analyticPlatform","bluePrintName","analyticSources","analyticCatalog","analyticTechniques","analyticOwner","analyticReadiness","analyticDocName","awsStatus","prdeixReadiness","analyticDes","coverageFlag","applicationDes","leadTime","fa","analyticOutcome","pod","remark"];
		var validCsv=["FUEL NAME","NERC CAUSE CODE","NERC FAILURE CODE","ANALYTICS APPLICATION","ANALYTIC INPUT TAGS","ANALYTIC NAME","ANALYTIC PLATFORM","BLUEPRINT NAME","ANALYTIC SOURCE","ANALYTIC CATALOG NAME","ANALYTIC TECHNIQUES","ANALYTIC OWNER","ANALYTIC READINESS","ANALYTIC DOCUMENT LINK","AWS STATUS","PREDIX READINESS","ANALYTIC DESCRIPTION","COVERAGE FLAG","APPLICATION DESCRIPTION","LEAD TIME","FA(%)","ANALYTIC OUTCOME","PoD(%)","REMARK"];
		var temp={};
		var actualArray=[];

	
		$scope.showAdvncOptn=function(){
			$scope.showAdvnc=!$scope.showAdvnc;
		}
		$('#csv-file').on('change', function (changeEvent) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$.loader_show();
				var bstr = e.target.result;
				var wb = XLSX.read(bstr, {type:'binary'});

				var wsname = wb.SheetNames[0];
				var ws = wb.Sheets[wsname];

				var aoa = XLSX.utils.sheet_to_json(ws, {header:1, raw:false});
				var cols = [];
				for(var i = 0; i < aoa[0].length; ++i) cols[i] = { field: aoa[0][i] };

				var data = [];
				for(var r = 1; r < aoa.length; ++r) {
					data[r-1] = {};
					for(i = 0; i < aoa[r].length; ++i) {
						if(aoa[r][i] == null){
							data[r-1][i] = ""
						}else{
							data[r-1][i] = aoa[r][i]	
						}
						
						//data[r-1][aoa[0][i]] = aoa[r][i]
					}
				}
				actualArray=[];
				console.log(data);
				console.log(cols);
				if(jQuery.isEmptyObject(data[0]) == true){

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
					if(cols.length != validCsv.length)
					{
						$.loader_hide();
						$scope.validateExcel=false;
						new PNotify({
							title: 'Required Field',
							text: 'Please Check the Template ',
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
						$.each(cols,function(i,val){
							if(validCsv[i].toLowerCase() != val.field.toLowerCase()){
								$.loader_hide();
								$scope.validateExcel=false;
								new PNotify({
									title: 'Required Field',
									text: 'Please Check the Template ',
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
						});

					}
					if($scope.validateExcel){
						$.each(data,function(i,val){	
							var temp={};
							temp['compIdSelected']="";
							$.each(val,function(_i,res){
							if(keys[_i] == 'analyticName' || keys[_i] == 'analyticDes' || keys[_i] == 'analyticDocName'  || keys[_i] == 'nercCauseCode' || keys[_i] == 'analyticOwner' || keys[_i] == 'analyticApplication' || keys[_i] == 'analyticPlatform' || keys[_i] == 'analyticSources' || keys[_i] == 'analyticReadiness'){
								if(res == ""){
									$.loader_hide();
									$scope.validateExcel=false;
									new PNotify({
										title: 'Required Field',
										text: 'Please fill the Mandatory fields in Row Number :'+(i+1),
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
							if($scope.validateExcel){
								if(res.match(regex) != null){
									$.loader_hide();
									$scope.validateExcel=false;
									new PNotify({
										title: 'Required Field',
										text: 'Enter valid input in Row Number :'+(i+1),
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
							if($scope.validateExcel){	
								if(keys[_i] == 'leadTime' || keys[_i] == 'pod' || keys[_i] == 'fa'  || keys[_i] == 'nercCauseCode'){
									if(isInteger(Number(res)) == false){
										$.loader_hide();
										$scope.validateExcel=false;
										new PNotify({
											title: 'Required Field',
											text: 'Enter number only for '+keys[_i].toUpperCase()+' in Row Number :'+(i+1),
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
									}else{
										temp[keys[_i]]=parseInt(res);
									}
								}
								else{
									temp[keys[_i]]=res;
								}
							}
							});
							if($scope.validateExcel){
								actualArray.push(temp);
							}

						});
						if($scope.validateExcel)
						{
							var bulkUploaddata={};
							bulkUploaddata['analytics']=actualArray;
							$scope.update=false;
							$.loader_hide();
							console.log(bulkUploaddata)
							$scope.analyticSubmitCall(bulkUploaddata);
						}
						
					}	
				}
				$scope.validateExcel=true;
			};
			reader.readAsBinaryString(changeEvent.target.files[0]);
			$("#csv-file").val("");
		});
		
		$scope.updateNerc=function(){
			if($scope.inUpdate){
				$scope.gridOptions.columnDefs[0].visible=true;	
			}
			else{
				$scope.gridOptions.columnDefs[0].visible=false;
				
			}
			$scope.updateTab=true;
			$scope.fromSearch=true;
			$scope.getSuggestion('NERCCauseCode',document.getElementById('nercSearch').value,'analytic','update');	
		}
		$scope.updateAnalytic=function(){
				if($scope.inUpdate){
					$scope.gridOptions.columnDefs[0].visible=true;	
				}
				else{
					$scope.gridOptions.columnDefs[0].visible=false;
					
				}
				$scope.updateTab=true;
				$scope.fromSearch=true;
				$scope.getSuggestion('AnalyticsName',document.getElementById('analyticNameSearch').value,'analytic','update');
			
		}
		$scope.updateAnalytics=function(){
			$scope.disableAnalytic=true;
			$scope.disableNerc=true;
			$('#nerc-submit').addClass('disable');
			$('#analytic-submit').addClass('disable');
			$('#nercCauseCodeField').removeClass('loadinggif');
			$('#analyticName').removeClass('loadinggif');
			if(!$('#collapseOne').hasClass('in')){
				$("#search-criteria").click();	
			}
			$('#add-analyitcs').removeClass('bg-color');
			$('#update-analyitcs').addClass('bg-color');
			$scope.gridOptions.data=null;
			$scope.addDiv=false;
			$scope.updateDiv=true;
			$scope.inUpdate=true;
			$scope.addUpdateForm=false;
			$scope.serachAccordian=true;
			$scope.serachCategory=true;
			$scope.searchHeader="Search Category";
			$scope.addUpate='Update';
			document.getElementById('analyticNameSearch').value="";
			document.getElementById('nercSearch').value="";
			$scope.showTable=false;
			$scope.showTableLabel=false;
			$scope.analyticCheck=false;
			$scope.nercCheck=false;
			
		}
		$scope.addAnalytics=function(){
			$('#nercCauseCodeField').removeClass('loadinggif');
			$('#analyticName').removeClass('loadinggif');
			$scope.update=false;
			$scope.updateDiv=true;
			$scope.analyticCheck=false;
			$scope.fromNerc=false;
			$scope.updateTab=false;
			$scope.addUpdateForm=true;
			//$scope.searchHeader="Result";
			$scope.serachAccordian=false;
			$scope.serachCategory=false;
			//$('#mainHeader').removeClass('txt-center');
			//$('#mainHeader').removeClass('pad');
			$('#add-analyitcs').addClass('bg-color');
			$('#update-analyitcs').removeClass('bg-color');
			$scope.addUpate='Add';
			$scope.inUpdate=false;
			document.getElementById('analyticNameSearch').value="";
			document.getElementById('nercSearch').value="";
			$scope.showTable=false;
			$scope.showTableLabel=false;
			if(!$('#collapseTwo').hasClass('in')){
				$("#search-result").click();	
			}
			resetFunction();
		}
		$scope.analyticExactMatch=function(){
				if(!$scope.inUpdate){
				$scope.gridOptions.data=$scope.tempAnalyticData;
				$scope.getSuggestionHeight();
				$scope.serachAccordian=true;
				$scope.serachCategory=false;
				$scope.showTable=true;
				$scope.showTableLabel=true;
				document.getElementById('searchLabel').innerHTML="";
				$scope.searchHeader="Analytics found with Analyitc Name: <span class='searchTag'>"+ document.getElementById('analyticName').value+"<span>";
				
				$('#searchLabel').removeClass('no-result');
				}
				if(!$('#collapseOne').hasClass('in')){
					$("#search-criteria").click();	
				}
				$('#update-tab').animate({scrollTop: '0px'}, 300);
		}
		$scope.analyticNercMatch=function(){
			if(!$scope.inUpdate){
			$scope.gridOptions.data=$scope.tempNercData;
			$scope.getSuggestionHeight();
			$scope.serachAccordian=true;
			$scope.serachCategory=false;
			$scope.showTable=true;
			$scope.showTableLabel=true;
			document.getElementById('searchLabel').innerHTML="";
			$scope.searchHeader="Analytics found with NERC Code: <span class='searchTag'>"+ document.getElementById('nercCauseCodeField').value+"<span>";
			$('#searchLabel').removeClass('no-result');
			}
			if(!$('#collapseOne').hasClass('in')){
				$("#search-criteria").click();	
			}
			$('#update-tab').animate({scrollTop: '0px'}, 300);
	}
		
		if(!$('#collapseTwo').hasClass('in')){
			$("#search-result").click();	
		}
		$scope.enableSearch=function(from){
			if(from == 'analyticNameSearch'){
				if(document.getElementById('analyticNameSearch').value != ""){
					$scope.disableAnalytic=false;
					//$('#nerc-submit').addClass('disable');
					$('#analytic-submit').removeClass('disable');
				}
				else{
					$scope.disableAnalytic=true;
					$('#analytic-submit').addClass('disable');
				}
			}else{
				if(document.getElementById('nercSearch').value != ""){
					$scope.disableNerc=false;
					//$('#nerc-submit').addClass('disable');
					$('#nerc-submit').removeClass('disable');
				}
				else{
					$scope.disableNerc=true;
					$('#nerc-submit').addClass('disable');
				}
			}
		}
	}]);  
})();