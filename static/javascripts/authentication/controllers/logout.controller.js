(function () {
  'use strict';

  angular
    .module('beanware.authentication.controllers')
    .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$scope', 'Authentication'];

  function LogoutController($scope, Authentication) {
    var vm = this;

    vm.logout = logout;

    function logout() {
      Authentication.logout();
    }
  }
})();
