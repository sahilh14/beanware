(function () {
  'use strict';

  angular
    .module('beanware.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    activate();

    function activate() {
      if (Authentication.isAuthenticated()) {
        var user = Authentication.getAuthenticatedAccount();
        if (user.is_admin) {
          $location.url('/adminuser');
        } else {
          $location.url('/userdata');
        }
      }
    }

    function login() {
      Authentication.login(vm.email, vm.password);
    }
  }
})();
