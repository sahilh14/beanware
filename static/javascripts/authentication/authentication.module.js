(function () {
  'use strict';

  angular
    .module('beanware.authentication', [
      'beanware.authentication.controllers',
      'beanware.authentication.services'
    ]);

  angular
    .module('beanware.authentication.controllers', []);

  angular
    .module('beanware.authentication.services', ['ngCookies']);
})();
