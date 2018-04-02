(function(){
  'use strict';

  angular.module("myApp")
    .directive('coverageDirective', coverageDirective);
  function coverageDirective(){
    var directive ={
      templateUrl:'../views/coverage.html'
    };
    return directive
  }

})();