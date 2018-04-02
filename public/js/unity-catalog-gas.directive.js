(function(){
  'use strict';

  angular.module("myApp")
    .directive('unityCatalogGasDirective', unityCatalogGasDirective);
  function unityCatalogGasDirective(){
    var directive ={
		
		restrict: "EA",
		templateUrl:function(tElement, tAttrs) {
				return tAttrs.templateUrl;
        },
		link: function(scope, iElement, iAttrs){{
			//...
			scope.$watch(function(){
				return iElement.css('display');
			},styleChangeFn,true);

			function styleChangeFn(value,old){
				if(value !== 'hidden'){
				//scope.filters.sidebar.fuel = {id:2, name:'GAS'};
				//scope.filters.sidebar.asset = {id:7, name:'BALANCE OF PLANT'};
				}
				else{
					//scope.filters.sidebar=null;
				}
		}}}
    };
				
    return directive;
	
	
  }

})();