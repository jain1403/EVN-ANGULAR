(function(){
  'use strict';

  angular.module("myApp")
    .directive('unityCatalogTransmissionDirective', unityCatalogTransmissionDirective);
  function unityCatalogTransmissionDirective(){
    var directive ={
      templateUrl:'views/catalog.html'
    };
    return directive
  }

})();