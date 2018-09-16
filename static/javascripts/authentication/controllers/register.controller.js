(function () {
  'use strict';

  angular
    .module('beanware.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication', '$http'];

  function RegisterController($location, $scope, Authentication, $http) {
    var vm = this;

    vm.register = register;
    activate();
    function activate() {
      if (Authentication.isAuthenticated()) {
        $location.url('/userdata');
      }
    }

    function register() {
      var b = Authentication.register(vm.email, vm.password, vm.username);
    }
  }
})();
