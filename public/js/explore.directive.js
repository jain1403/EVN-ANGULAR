(function(){
  'use strict';

  angular.module("myApp")
    .directive('exploreDirective', exploreDirective);
  function exploreDirective(){
    var directive ={
      templateUrl:'../views/explore.html'
    };
    return directive
  }

})();