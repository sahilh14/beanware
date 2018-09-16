(function () {
  'use strict';

  angular
    .module('beanware', [
      'beanware.config',
      'beanware.routes',
      'beanware.authentication',
      'beanware.data'
    ]);

  angular
    .module('beanware')
    .run(run);

  run.$inject = ['$http'];

  angular
    .module('beanware.routes', ['ngRoute']);

  angular
  .module('beanware.config', []);

function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}
})();
