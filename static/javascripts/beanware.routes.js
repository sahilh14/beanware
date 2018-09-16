(function () {
  'use strict';

  angular
    .module('beanware.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/userdata', {
      controller: 'DataController',
      templateUrl: '/static/templates/data/display_data.html'
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/adminuser', {
      controller: 'AdminController',
      templateUrl: '/static/templates/data/admin.html'
    }).otherwise('/');
  }
})();
