(function() {
	'use strict';

	var app=angular.module("myApp");
	app.controller('toPipelineCtrl',['$scope','addAnalyticsService','$state','uiGridConstants','uiGridGroupingConstants','$filter','$timeout','$rootScope','NetworkCallService','csvService', function ($scope,addAnalyticsService,$state,uiGridConstants,uiGridGroupingConstants,$filter,$timeout,$rootScope,NetworkCallService,csvService) {
		$.loader_show();
		$rootScope.currentParent=$state.current.name;
		sessionStorage.setItem('currentPage',$state.current.name);
		$scope.showAdvncOptnBklg=false;
		$scope.validateExcel=true;
		$scope.validInput=true;
		$scope.numericValidation=true;
		$scope.analyticCheck=false;
		$scope.fromNerc=false;
		$scope.update=false;
		$scope.updateDiv=true;
		$scope.addUpdateForm=true;
		$scope.addUpate="Add";
		$scope.update=false;
		$scope.clickfrmAdd=false;
		$scope.serachAccordian=false;
		$scope.serachCategory=false;
		$scope.coverageFlagValue="";
		$('#nerc-submit').addClass('disable');
		$('#analytic-submit').addClass('disable');
		$scope.disableAnalytic=true;
		$scope.disableNerc=true;
		var regex = /^[^a-zA-Z0-9]+$/
		//$('#coverageBklgNo').prop('checked', true);
		$('#add-analyitcs').addClass('bg-color');
		$(document).ready(

				function () {

					$("#fuelName").select2({
						placeholder: 'Select Fuel Type...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});
					$("#assetName").select2({
						placeholder: 'Select Asset...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});
					$("#systemName").select2({
						placeholder: 'Select System...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});
					$("#subSystemName").select2({
						placeholder: 'Select Sub-System...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});
					$("#compName").select2({
						placeholder: 'Select Component...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});
					$("#fuelNameEBS").select2({
						placeholder: 'Select Fuel Type...',
						minimumResultsForSearch: 4, 
						allowClear: true
					});
					/*$("#nercCode").select2({
						placeholder: 'Select Failure Code...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});*/
					$("#backlogStatus").select2({
						placeholder: 'Select Analytic Source...', // Place holder text to place in the select
						minimumResultsForSearch: 4, // Overrides default of 15 set above
						allowClear: true
					});

				});
		function resize(){
			document.getElementById('update-tab').style.height=($(window).height()-64-43)+'px';
			setTimeout(function(){
				var offset=$rootScope.isOpen?230:50;
				document.getElementById('mainView').style.width=($(window).width()-offset)+'px';
				document.getElementById('mainView').style.height=($(window).height()-64)+'px';
			},400);
		}
		$(window).off('resize');
		$(window).on('resize',function() {
			resize();
		});

		$rootScope.$watch('isOpen', function() {
			if($state.current.name == 'coverage.toPipeline')
				resize();
		});

		/*$('#backlogTarget').datepicker({
			minDate: new Date(),
			changeMonth: true,
			changeYear: true,
			dateFormat: "mm/dd/yy"
		});
*/
		$scope.fuelName=[];
		$scope.assetName=[];
		$scope.systemName=[];
		$scope.compName=[];
		$scope.nercCode=[];
		$scope.backlogApplication=[];
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
				setTimeout(function(){$('#addApmMainDiv').addClass('scroll-bar');},200);
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
						setTimeout(function(){$('#addApmMainDiv').addClass('scroll-bar');},200);
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
			nercFunction(data.failureMasters);
			_.forEach(data.applicationMasters,function(data){
				var temp={};
				temp.id=data.id;
				temp.name=data.name;
				$scope.backlogApplication.push(temp);	
			});
			_.forEach(data.analyticInputTag,function(data){
				var temp={};
				temp.id=data.id;
				temp.name=data.name;
				$scope.analyticInputTag.push(temp);	
			});
			setTimeout(function(){
				$(".chosen-select").chosen();
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
			$scope.fuelId=fuelName;
			$scope.assetIdSelected="0";
			$scope.assetName=[];
			if(document.getElementById('fuelName').value != ""){
				$("#assetName").prop("disabled", false);
				$scope.assetName=_.map(_.filter($scope.assetMainData, {fuelName: fuelName}), 'assetData')[0];
			}
			$scope.$apply();	
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
			var assetId=document.getElementById('assetName').value;
			$scope.assetId=assetId;
			if(document.getElementById('assetName').value != ""){
				$.loader_show();
				$scope.systemLevelCall(assetId);
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
			$scope.systemId=systemId;
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
			$scope.subSystemIdSelected=subSystemIdSelected;

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

		$scope.onChangenercCode=function(nercCodeSelected){
			$scope.nercCodeSelected=(document.getElementById('nercCode').value).split(/-(.+)/)[0];
		}
		$scope.onChangeEBS=function(fuelMasterId){
			$scope.fuelModelName=document.getElementById('fuelNameEBS').value;
		}
		function resetFunction(){
			document.getElementById('backlogName').value="";
			document.getElementById('backlogDesc').value="";
			//document.getElementById('backlogSource').value="";
			document.getElementById('backlogOwner').value="";
			document.getElementById('backlogComment').value="";
			//document.getElementById('backlogUserstory').value="";
			//document.getElementById('backlogTeam').value="";
			document.getElementById('backlogOutcome').value="";
			//document.getElementById('backlogTarget').value="";
			document.getElementById('nercCauseCodeFieldBklg').value="";
			$scope.showAdvncOptnBklg=false;
			$("#fuelName").select2("val", "");
			$("#assetName").select2("val", "");
			$("#systemName").select2("val", "");
			$("#subSystemName").select2("val", "");
			$("#compName").select2("val", "");
			//$("#nercCode").select2("val", "");
			$("#backlogStatus").select2("val", "In Progress");
			$("#assetName").prop("disabled", true);
			$("#systemName").prop("disabled", true);
			$("#subSystemName").prop("disabled", true);
			$("#compName").prop("disabled", true);
			$('input[name="coverageFlag"]').prop('checked', false);
			//$('#coverageBklgNo').prop('checked', true);
			$("#backlogApplication").val('').trigger("chosen:updated");
			$("#nercCode").val('').trigger("chosen:updated");
			$("#fuelNameEBS").select2("val", "");
			
			$scope.coverageFlagValue="";

		}

		$scope.resetData=function(){
			resetFunction();
		}
		$scope.columns= [
		                 { name:'analyticName',displayName: 'Analytic Name',cellTooltip: true },
		                 { name:'analyticStatus',displayName: 'Status',cellTooltip: true },
		                 ];

		$scope.columnVisibility=false;
		$scope.success = {
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
							$scope.analyticCheck=false;
							$scope.nercCheck=false;
							$('#backlogNameDiv').removeClass('pd-bt');
						}
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
						$('#backlogNameDiv').removeClass('pd-bt');
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
			$.loader_hide();
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
			$('#pipeLineModal').modal('show');

		}


		$scope.analyticSubmitCall=function(singleUpldBklgData){
			var token=sessionStorage.getItem('token');
			if($scope.update){
				var data={};
				data['newData']=singleUpldBklgData.backlog[0];
				data['oldData']=$scope.oldData;
				console.log(JSON.stringify(data));
				addAnalyticsService.updateAnalyticCall(data,"updateBacklog").then(function(data){
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
							$scope.getSuggestion('BacklogName',document.getElementById('analyticNameSearch').value,'backlog','update');	
							}
							else{
								if(document.getElementById('nercSearch').value != "" && document.getElementById('nercSearch').value != undefined){
									$scope.getSuggestion('NERCCauseCode',document.getElementById('nercSearch').value,'backlog','update');
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
				console.log(singleUpldBklgData);
			addAnalyticsService.saveBacklogCall(singleUpldBklgData,token).then(function(data){
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
					if(singleUpldBklgData.backlog.length > 1)
					{
						bulkUpload(data);
					}
					else{
						singleUpload(data);
					}
					angular.forEach(sessionStorage, function (item,key) {
						if(!(key == 'SSO' || key == 'loggedIn' || key == 'refreshToken' || key == 'token' || key == 'userDetails' || key == 'currentPage'))
						{
							sessionStorage.removeItem(key);	
						}
					});
				}
			},function(error){
				alert('Unable to connect to the Services!');
				$.loader_hide();
			});
		}

		}
		function isInteger(x) { return (x^0) === x; } ;
		function serviceCall() {

			if(!isInteger(Number(document.getElementById('nercCauseCodeFieldBklg').value)) == true){

				if(!isInteger(Number(document.getElementById('nercCauseCodeFieldBklg').value)) == true){
					document.getElementById("nercCauseCodeFieldBklg").focus();
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
				if(document.getElementById('backlogName').value == "" || document.getElementById('backlogName').value == undefined){
					$scope.submitData.backlogName=null;	
				}
				else{
					$scope.submitData.backlogName=document.getElementById('backlogName').value;	
				}
				if(document.getElementById('backlogDesc').value == "" || document.getElementById('backlogDesc').value == undefined){
					$scope.submitData.backlogDesc=null;	
				}
				else{
					$scope.submitData.backlogDesc=document.getElementById('backlogDesc').value;	
				}
				/*if(document.getElementById('backlogSource').value == "" || document.getElementById('backlogSource').value == undefined){
					$scope.submitData.backlogSource=null;	
				}
				else{
					$scope.submitData.backlogSource=document.getElementById('backlogSource').value;	
				}*/
				if(document.getElementById('backlogOwner').value == "" || document.getElementById('backlogOwner').value == undefined){
					$scope.submitData.backlogOwner=null;	
				}
				else{
					$scope.submitData.backlogOwner=document.getElementById('backlogOwner').value;	
				}
				if(document.getElementById('backlogComment').value == "" || document.getElementById('backlogComment').value == undefined){
					$scope.submitData.backlogComment=null;	
				}
				else{
					$scope.submitData.backlogComment=document.getElementById('backlogComment').value;	
				}
				/*if(document.getElementById('backlogUserstory').value == "" || document.getElementById('backlogUserstory').value == undefined){
					$scope.submitData.backlogUserstory=null;	
				}
				else{
					$scope.submitData.backlogUserstory=document.getElementById('backlogUserstory').value;	
				}*/
				/*if(document.getElementById('backlogTeam').value == "" || document.getElementById('backlogTeam').value == undefined){
					$scope.submitData.backlogTeam=null;	
				}
				else{
					$scope.submitData.backlogTeam=document.getElementById('backlogTeam').value;	
				}*/
				if(document.getElementById('backlogOutcome').value == "" || document.getElementById('backlogOutcome').value == undefined){
					$scope.submitData.backlogOutcome=null;	
				}
				else{
					$scope.submitData.backlogOutcome=document.getElementById('backlogOutcome').value;	
				}
				if($scope.showAdvncOptnBklg){
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
					$scope.submitData.assetId=document.getElementById('assetName').value;	
				}
				if(document.getElementById('systemName').value == "" || document.getElementById('systemName').value == undefined){
					$scope.submitData.systemId=null;	
				}
				else{
					$scope.submitData.systemId=document.getElementById('systemName').value;	
				}
				
				
				if(document.getElementById('subSystemName').value == "" || document.getElementById('subSystemName').value == undefined){
					$scope.submitData.subSystemId=null;	
				}
				else{
					$scope.submitData.subSystemId=document.getElementById('subSystemName').value;	
				}
				if(document.getElementById('compName').value == "" || document.getElementById('compName').value == undefined){
					$scope.submitData.compIdSelected=null;
				}
				else{
					$scope.submitData.compIdSelected=document.getElementById('compName').value;
				}
				
				if(document.getElementById('nercCauseCodeFieldBklg').value == "" || document.getElementById('nercCauseCodeFieldBklg').value == undefined){
					$scope.submitData.nercCauseCode=null;	
				}
				else{
					$scope.submitData.nercCauseCode=parseInt(document.getElementById('nercCauseCodeFieldBklg').value);	
				}
				/*if(document.getElementById('nercCode').value == "" || document.getElementById('nercCode').value == undefined){
					$scope.submitData.failureName=null;	
				}
				else{
					$scope.submitData.failureName=(document.getElementById('nercCode').value).split(/-(.+)/)[0];	
				}*/
				if(document.getElementById('backlogStatus').value == "" || document.getElementById('backlogStatus').value == undefined){
					$scope.submitData.backlogStatus=null;	
				}
				else{
					$scope.submitData.backlogStatus=document.getElementById('backlogStatus').value;	
				}
				if(document.querySelector('input[name="coverageFlag"]:checked') != null){
					$scope.submitData.coverageFlag=document.querySelector('input[name="coverageFlag"]:checked').value;
				}
				else{
					$scope.submitData.coverageFlag="";
				}
				if(($("#backlogApplication").chosen().val()).filter(String).join() == "" || ($("#backlogApplication").chosen().val()).filter(String).join() == undefined){
					$scope.submitData.backlogApplication="";	
				}
				else{
					$scope.submitData.backlogApplication=($("#backlogApplication").chosen().val()).filter(String).join();
				}
				if(($("#nercCode").chosen().val()).filter(String).join() == "" || ($("#nercCode").chosen().val()).filter(String).join() == undefined){
					$scope.submitData.failureCode="";	
				}
				else{
					$scope.submitData.failureCode=($("#nercCode").chosen().val()).filter(String).join();
				}
				
				var singleUploadBacklog={};
				singleUploadBacklog['backlog']=[];
				singleUploadBacklog['backlog'].push($scope.submitData);
				console.log(JSON.stringify(singleUploadBacklog));
				//$.loader_hide();
				$scope.analyticSubmitCall(singleUploadBacklog);

			}
		}	
		function checkSpecialCharOnly(){
			var testpass=true;
			$.each( $(".validationField"), function(index, ele){
				if(document.getElementById(ele.id).value.match(regex) != null){
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
				serviceCall();
		}
		$scope.analyticSubmit=function(){
			if($scope.showAdvncOptnBklg){

				if(document.getElementById('fuelName').value == "" || document.getElementById('assetName').value == "" || document.getElementById('systemName').value == "" || document.getElementById('subSystemName').value == "" || document.getElementById('compName').value == "" || document.getElementById('backlogName').value == ""  || document.getElementById('backlogDesc').value == ""){
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

				if(document.getElementById('nercCauseCodeFieldBklg').value == "" || document.getElementById('fuelNameEBS').value == "" || document.getElementById('backlogName').value == ""  || document.getElementById('backlogDesc').value == ""){
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

		$scope.downloadTempBacklog=function(){
			csvService.downloadTemplateBacklog().then(function(data){
			},function(error){
				alert('Unable to Find the Template!');
				$.loader_hide();
			});
		}
		$scope.uploadCsvBacklog=function(){
			$('#csv-file-backlog').click();
		}
		
		var keys=["fuelName","nercCauseCode","failureCode","backlogApplication","backlogName","backlogStatus","backlogDesc","coverageFlag","backlogOutcome","backlogComment","backlogOwner"],
		validCsv=["FUEL NAME","NERC CAUSE CODE","NERC FAILURE CODE","BACKLOG APPLICATION","BACKLOG NAME","BACKLOG STATUS","BACKLOG DESCRIPTION","COVERAGE FLAG","BACKLOG OUTCOME","BACKLOG COMMENT","BACKLOG OWNER" ],
		temp={},
		actualArray=[];
		$scope.showAdvncOptn=function(){
			$scope.showAdvnc=!$scope.showAdvnc;
		}

		$scope.AdvncOptnBklgClick=function(){
			$scope.showAdvncOptnBklg=!$scope.showAdvncOptnBklg;
		}
		setTimeout(function(){$("#backlogStatus").select2("val", "In Progress");},200);
		
		var removeTemplate = '<i title="Edit Analytics" class="fa fa-pencil-square-o editIcon" aria-hidden="true" ng-click="grid.appScope.edit(row)"></i>';
		  $scope.gridOptions = {
				  enableFiltering: true,
				  enableGridMenu: true,
				  enableColumnResizing: true
		  };
		  $scope.edit = function(row) {
			  console.log(row.entity);
			  $scope.update=true;
			  $scope.oldData=row.entity;
			  if(row.entity.backlog_name == undefined || row.entity.backlog_name == null)
			  {
				  document.getElementById('backlogName').value="";
			  }
			  else{
				  document.getElementById('backlogName').value=row.entity.backlog_name;
			  }
			  if(row.entity.backlog_description == undefined || row.entity.backlog_description == null)
			  {
				  document.getElementById('backlogDesc').value="";
			  }
			  else{
				  document.getElementById('backlogDesc').value=row.entity.backlog_description;
			  }
			  if(row.entity.backlog_outcome == undefined || row.entity.backlog_outcome == null)
			  {
				  document.getElementById('backlogOutcome').value="";
			  }
			  else{
				  document.getElementById('backlogOutcome').value=row.entity.backlog_outcome;
			  }
			  /*if(row.entity.backlog_team == undefined || row.entity.backlog_team == null)
			  {
				  document.getElementById('backlogTeam').value="";
			  }
			  else{
				  document.getElementById('backlogTeam').value=row.entity.backlog_team;
			  }*/
			  if(row.entity.backlog_owner == undefined || row.entity.backlog_owner == null)
			  {
				  document.getElementById('backlogOwner').value="";
			  }
			  else{
				  document.getElementById('backlogOwner').value=row.entity.backlog_owner;
			  }
			  /*if(row.entity.backlog_target == undefined || row.entity.backlog_target == null)
			  {
				  document.getElementById('backlogTarget').value="";
			  }
			  else{
				  document.getElementById('backlogTarget').value=row.entity.backlog_target;
			  }*/
			  //$("#backlogStatus").select2("val", row.entity.backlog_status);	
			  if(row.entity.aws_readiness == null)
			  {
				  $("#backlogStatus").select2("val", 'Not Started');	
			  }
			  if(row.entity.aws_readiness == "0")
			  {
				  $("#backlogStatus").select2("val", 'In Progress');
			  }
			  if(row.entity.aws_readiness == "1")
			  {
				  $("#backlogStatus").select2("val", 'Completed');
			  }
			  $("#fuelNameEBS").select2("val", row.entity.fuelName);

			  if(row.entity.coverage_items_flag == "0"){
				  $scope.coverageFlagValue="no";

			  }
			  else{
				  $scope.coverageFlagValue="yes";
			  }
			 /* if(row.entity.backlog_source == undefined || row.entity.backlog_source == null)
			  {
				  document.getElementById('backlogSource').value="";
			  }
			  else{
				  document.getElementById('backlogSource').value=row.entity.backlog_source;
			  }*/
			  if(row.entity.backlog_comment == undefined || row.entity.backlog_comment == null)
			  {
				  document.getElementById('backlogComment').value="";
			  }
			  else{
				  document.getElementById('backlogComment').value=row.entity.backlog_comment;
			  }
			 /* if(row.entity.backlog_userstory == undefined || row.entity.backlog_userstory == null)
			  {
				  document.getElementById('backlogUserstory').value="";
			  }
			  else{
				  document.getElementById('backlogUserstory').value=row.entity.backlog_userstory;
			  }*/
			  if(row.entity.nerc_cause_code == undefined || row.entity.nerc_cause_code == null)
			  {
				  document.getElementById('nercCauseCodeFieldBklg').value="";
			  }
			  else{
				  document.getElementById('nercCauseCodeFieldBklg').value=row.entity.nerc_cause_code;
			  }
			  if(row.entity.app_name != null)
				  $("#backlogApplication").val(row.entity.app_name.split(',')).trigger("chosen:updated");
			  if(row.entity.failureCode != null)
				  $("#nercCode").val(row.entity.failureCode.split(',')).trigger("chosen:updated");
			  
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
			  setTimeout(function(){
				  $scope.$apply();	
			  },0);
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
	                                        	 name: 'backlog_name',
	                                        	 displayName: 'Backlog Name',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: true
	                                         },
	                                         {
	                                        	 name: 'backlog_description',
	                                        	 displayName: 'Backlog Description',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: true
	                                         },
	                                         
	                                         {
	                                        	 name: 'backlog_comment',
	                                        	 displayName: 'Backlog Comment',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: true
	                                         },
	                                         {
	                                        	 name: 'backlog_outcome',
	                                        	 displayName: 'Backlog Outcome',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: true
	                                         },
	                                         {
	                                        	 name: 'backlog_owner',
	                                        	 displayName: 'Backlog Owner',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: true
	                                         },
	                                         {
	                                        	 name: 'coverage_items_flag',
	                                        	 displayName: 'Coverage Flag',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: false
	                                         },
	                                         {
	                                        	 name: 'failureName',
	                                        	 displayName: 'Failure Name',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: false
	                                         },
	                                         {
	                                        	 name: 'app_name',
	                                        	 displayName: 'Application Name',
	                                        	 width:'20%',
	                                        	 cellTooltip: true,
	                                        	 visible: false
	                                         }
	                                         ];
			
			
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
						   		if(data[i].application_name != null)
							    data[i].app_name=(_.uniq(data[i].application_name.split(','))).toString();
						   		if(data[i].backlog_target != null)
						   		data[i].backlog_target=moment(data[i].backlog_target).format('MM/DD/YYYY');
						   		if(data[i].app_name == null)
								data[i].app_name="";
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
								    return o.analytic_name == document.getElementById('backlogName').value; 
								 });
								if(match.length > 0){
									$scope.analyticCheck=true;
									$('#backlogNameDiv').addClass('pd-bt');
									$scope.gridOptions.data=data;
									$scope.getSuggestionHeight(from);
									document.getElementById('analyticNameSearch').value=document.getElementById('backlogName').value;
								}
								else{
									$scope.analyticCheck=false;
									$('#backlogNameDiv').removeClass('pd-bt');
								}
							}
							$('#backlogName').removeClass('loadinggif');
						}
					}else{
						if($scope.fromNerc && $scope.fromNerc != undefined){
							$scope.tempNercData=data;
							$scope.nercCheck=true;
							document.getElementById('nercSearch').value=document.getElementById('nercCauseCodeFieldBklg').value;
							document.getElementById('analyticNameSearch').value="";
							$('#nercCauseCodeFieldBklg').removeClass('loadinggif');
							$scope.fromNerc=false;
							$scope.searchHeader="Analytics found with NERC Code: <span class='searchTag'>"+ document.getElementById('nercCauseCodeFieldBklg').value+"<span>";
						}else{
							$scope.analyticCheck=true;
							$scope.tempAnalyticData=data;
							$('#backlogNameDiv').addClass('pd-bt');
							document.getElementById('analyticNameSearch').value=document.getElementById('backlogName').value;
							document.getElementById('nercSearch').value="";
							$('#backlogName').removeClass('loadinggif');
							$scope.searchHeader="Analytics found with Analyitc Name: <span class='searchTag'>"+ document.getElementById('backlogName').value+"<span>";
							
						}
						
						$scope.gridOptions.data=data;
						$scope.getSuggestionHeight(from);
						$.loader_hide();
						}
					}
					else{
						if($scope.inUpdate){
							if($scope.fromSearch){
								$('#backlogNameDiv').addClass('pd-bt');
								$scope.showTable=false;
								$scope.showTableLabel=true;
								document.getElementById('searchLabel').innerHTML="No Result Found !!"
								$('#searchLabel').addClass('no-result');
								$.loader_hide();
							}
							else{
								$('#analyticName').removeClass('loadinggif');
								$scope.analyticCheck=false;
								$('#backlogNameDiv').removeClass('pd-bt');
							}
						}
						else{
							$('#backlogName').removeClass('loadinggif');
							$('#nercCauseCodeFieldBklg').removeClass('loadinggif');
							$('#backlogNameDiv').removeClass('pd-bt');
							$scope.analyticCheck=false;
							$scope.serachAccordian=false;
							$scope.serachCategory=false;
							$scope.showTable=false;
							$scope.nercCheck=false;
							$scope.showTableLabel=false;
							$scope.fromNerc=false;
						}
						
					}
					},function(error){
						alert('Unable to connect to the Services!');
						$.loader_hide();
						$('#nercCauseCodeFieldBklg').removeClass('loadinggif');
						$('#backlogName').removeClass('loadinggif');
						$scope.analyticCheck=false;
						$scope.nercCheck=false;
					});
				
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
			
			
			$('#csv-file-backlog').on('change', function (changeEvent) {
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
									if(keys[_i] == 'backlogName' || keys[_i] == 'backlogDesc' || keys[_i] == 'nercCauseCode' ){
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
									if(keys[_i] == 'nercCauseCode'){
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
										}else{
											temp[keys[_i]]=parseInt(res);
										}
									}
									else{
										temp[keys[_i]]=res;
										/*if(keys[_i] == 'backlogTarget'){
											var pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
											if(pattern.test(res)|| moment(res).isValid()){
												temp[keys[_i]]=res;
											}
											else{
												$.loader_hide();
												$scope.validateExcel=false;
												new PNotify({
													title: 'Required Field',
													text: 'Enter Valid Date for Backlog Target in Row Number :'+(i+1),
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
										}
										else{
											temp[keys[_i]]=res;
										}*/
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
								bulkUploaddata['backlog']=actualArray;
								$scope.update=false;
								console.log(actualArray);
								$scope.analyticSubmitCall(bulkUploaddata);
							}
							
						}	
					}
					$scope.validateExcel=true;
				};
				reader.readAsBinaryString(changeEvent.target.files[0]);
				$("#csv-file-backlog").val("");
			});
			
			$scope.addAnalytics=function(){
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
			$scope.updateAnalytics=function(){
				$scope.disableAnalytic=true;
				$scope.disableNerc=true;
				$('#nerc-submit').addClass('disable');
				$('#analytic-submit').addClass('disable');
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
			$scope.analyticExactMatch=function(){
				if(!$scope.inUpdate){
				$scope.gridOptions.data=$scope.tempAnalyticData;
				$scope.getSuggestionHeight();
				$scope.serachAccordian=true;
				$scope.serachCategory=false;
				$scope.showTable=true;
				$scope.showTableLabel=true;
				document.getElementById('searchLabel').innerHTML="";
				$scope.searchHeader="Analytics found with Analyitc Name: <span class='searchTag'>"+ document.getElementById('backlogName').value+"<span>";
				
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
			$scope.searchHeader="Analytics found with NERC Code: <span class='searchTag'>"+ document.getElementById('nercCauseCodeFieldBklg').value+"<span>";
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
		
		$scope.updateNerc=function(){
			if($scope.inUpdate){
				$scope.gridOptions.columnDefs[0].visible=true;	
			}
			else{
				$scope.gridOptions.columnDefs[0].visible=false;
				
			}
			$scope.updateTab=true;
			$scope.fromSearch=true;
			$scope.getSuggestion('NERCCauseCode',document.getElementById('nercSearch').value,'backlog','update');	
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
			$scope.getSuggestion('BacklogName',document.getElementById('analyticNameSearch').value,'backlog','update');
		}
		$scope.checkNercCode=function(){
			if($scope.inUpdate){
				$scope.gridOptions.columnDefs[0].visible=true;	
			}
			else{
				$scope.gridOptions.columnDefs[0].visible=false;
				if(document.getElementById('nercCauseCodeFieldBklg').value != "" && isInteger(Number(document.getElementById('nercCauseCodeFieldBklg').value))){
					$('#nercCauseCodeFieldBklg').addClass('loadinggif');
					$scope.fromNerc=true;
					$scope.getSuggestion('NERCCauseCode',document.getElementById('nercCauseCodeFieldBklg').value,'backlog','add');
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
			if(document.getElementById('backlogName').value != "" && document.getElementById('backlogName').value.match(regex) == null){
				$('#backlogName').addClass('loadinggif');
				if($scope.inUpdate)
				$scope.fromSearch=false;	
				$scope.getSuggestion('BacklogName',document.getElementById('backlogName').value,'backlog','update');
			}
			else{
				$scope.analyticCheck=false;
			}
		}
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