(function () {
  'use strict';

  angular
    .module('beanware.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  function Authentication($cookies, $http) {
    var Authentication = {
      register: register,
      login: login,
      logout: logout,
      getAuthenticatedAccount: getAuthenticatedAccount,
      setAuthenticatedAccount: setAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      unauthenticate: unauthenticate
    };

    return Authentication;

    function register(email, password, username) {
      return $http.post('signup/', {
        username: username,
        password: password,
        email: email
      }).then(registerSuccessFn, registerErrorFn);

      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, password);
      }

      function registerErrorFn(data, status, headers, config) {
        console.error('failure!');
      }
    };


    function login(email, password) {
      return $http.post('signin/', {
        email: email,
        password: password
      }).then(loginSuccessFn, loginErrorFn);

      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);
        if (data.data.is_admin) {
          window.location = '/adminuser';
        } else {
          window.location = '/userdata';
        }
      }

      function loginErrorFn(data, status, headers, config) {
        console.error('failure!');
      }
    };

    function logout() {
      return $http.post('signout/')
      .then(logoutSuccessFn, logoutErrorFn);

      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '/';
      }

      function logoutErrorFn(data, status, headers, config) {
        console.error('failure!');
      }
    };

    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }
      return JSON.parse($cookies.authenticatedAccount);
    }

    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
    }

    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }

    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }
  }
})();
