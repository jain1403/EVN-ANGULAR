(function(){
  'use strict';

  angular.module("myApp")
    .directive('unityCatalogDirective', unityCatalogDirective);
  function unityCatalogDirective(){
    var directive ={
      templateUrl:'views/catalog.html'
    };
    return directive
  }

})();