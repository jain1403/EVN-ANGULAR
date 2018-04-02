(function(){
  'use strict';

  angular.module("myApp")
    .directive('customTreeDirective', customTreeDirective);
  function customTreeDirective(){
    var directive ={
      restrict:'EA',
      templateUrl:'../views/custom-tree.html',
      link: linkFn,
      controller: customController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive
  }

  function linkFn(){

    console.log("inside the linking function");
  }

  function customController($scope,analyticService){
    var vm=this;
    // vm.gridData = analyticService.getAnalyticData();
    //
    // vm.gridData.then(function(response){
    //   return response;
    // });

    vm.gridData=[{
      "fuelType":"Gas",
      "taxonomyDepth":0,
      "children":[
        {
          "assetMasterId": 1,
          "assetId": "5000-5299",
          "assetName": "GAS TURBINE",
          "taxonomyDepth":1,
          "children":[
            {
              "sysMasterId": 1,
              "systemId": "5110-5190",
              "systemName": "Auxiliary Systems",
              "taxonomyDepth":2,
              "children":[
                {
                  "subsysMasterId": "1",
                  "subSystemId": null,
                  "subSystemName": "Auxiliary Systems",
                  "taxonomyDepth":3,
                  "children":[
                    {
                      "compMasterId": 80,
                      "compName": "Lube oil system - general",
                      "compId": "5110",
                      "taxonomyDepth":4,
                      "children":[
                        {
                          "failureMasterId": 105,
                          "failureName": "",
                          "failureId": "5110.1",
                          "taxonomyDepth":5,
                          "children":[
                            {
                              "APM_ANALYTICS": null,
                              "analyticCoverageMnD": "BMT_HLTH_CHGE",
                              "analyticCoverageSS": null,
                              "analyticCoverageCatelog": null,
                              "taxonomyDepth":6,
                              "children":[]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }];
var newarry=[];
    for (var i=0; i< vm.gridData.length; i++){
      newarry.push(vm.gridData[i]);

      if(vm.gridData[i].children){

      for(var x=0; x < vm.gridData[i].children.length; x++){

        newarry.push(vm.gridData[i].children[x]);
        console.log(newarry);
      }
      }
    }

    vm.gridOptions = {
      enableSorting: true,
      data:vm.gridData,
      enableHorizontalScrollbar:0,
      columnDefs: [
        {field: 'assetName', name: 'assetName', cellClass:'cell_styling', headerCellClass: 'cell_header_styling'},
        {field:'assetId', name:'assetId', cellClass:'cell_styling', headerCellClass: 'cell_header_styling'},
        {field:'assetMasterId', cellClass:'cell_styling', headerCellClass: 'cell_header_styling'},
        {field:'sysMasterId', cellClass:'cell_styling', headerCellClass: 'cell_header_styling'}
      ]
    };

  }

})();