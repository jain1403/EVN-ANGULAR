(function() {

  angular.module("myApp").factory('analyticService', function ($http) {

    return {

      getAnalyticData: function(){
        return $http({
            method: 'GET',
            url:'/analytics'
          }
        ).then(function (response){
          console.log(response.data);
          return response.data;
        });
      }
    }


  });
})();