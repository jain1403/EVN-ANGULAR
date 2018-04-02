angular.module('core-angular1-seed')
  .config(function($stateProvider, $urlRouterProvider) {

    
$stateProvider.when('/','/catalog/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './app/home/home.html',
        controller: 'HomeController as home'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: './app/contact/contact.html',
        controller: 'ContactController as contact'
      });

  });