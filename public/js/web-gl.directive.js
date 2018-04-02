(function(){
  'use strict';

  angular.module("myApp")
    .directive('webGlDirective', webGlDirective);
  function webGlDirective(){
    var directive ={
      templateUrl:'views/web-gl-template.html',
      link: linkFn,
      controller: webGlController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

    function linkFn(){
    }
    function webGlController (){
     UnityLoader.instantiate("gameContainer", "Build/unity-export.json");
    }
  }

})();