(function () {
  'use strict';
  angular
    .module('beanware.data.controllers')
    .filter('capitalize', function() {
      return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      }
  });

  angular
    .module('beanware.data.controllers')
    .controller('DataController', DataController);

  DataController.$inject = ['$location', '$scope', '$http', 'Authentication', '$interval', '$route'];

  function DataController($location, $scope, $http, Authentication, $interval, $route) {

    var promise;
    $scope.done = false;
    $scope.showdetail = false;
    $scope.new_events = false;
    $scope.authenticated = Authentication.isAuthenticated();

    if ($scope.authenticated) {
      var user = Authentication.getAuthenticatedAccount();
      get_data();

    }
    
    $scope.get_detail = function (doc) {
      $scope.detail = [];
      $scope.document_detail = JSON.parse(JSON.stringify( doc ));
      $scope.showdetail = true;
      delete $scope.document_detail.read_status;
      delete $scope.document_detail.id;
      delete $scope.document_detail.$$hashkey;
      for (var key in $scope.document_detail) {
        if ($scope.document_detail.hasOwnProperty(key)) {
          if (key != "$$hashKey")
            $scope.detail.push(key)
        }
      }
    }

    function apiRequest(data) {
      return $http({
        method: data.requestType,
        url: data.requestUrl,
        headers: data.headers,
        data: data.requestData
      })
    };

    $scope.markedRead = function (doc) {
      var data = {};
      data.requestType = 'PUT';
      data.requestUrl = 'event_data/?&user=' + user.username + '&id=' + doc.id + '&type=' + doc.type;
      data.requestData = {'read_status': true};
      apiRequest(data).then(
        function(result){
      });
    }

    $scope.reload = function () {
      $route.reload();
    }

    function watch() {
      var data = {};
      data.requestType = 'GET';
      data.requestUrl = 'watch_db/?&user=' + user.username + '&count=' + $scope.data_length;

      apiRequest(data).then(
        function(result){
          if (result.data == 'Success') {
            $scope.new_events = true
            $scope.stop();
          }
      });

    }

    $scope.stop = function () {
      $interval.cancel(promise);
    }

    function get_data() {
      var data = {};
      data.requestType = 'GET';
      data.requestUrl = 'event_data/?&user=' + user.username;

      apiRequest(data).then(
        function(result){
          $scope.data_length = result.data.length;
          $scope.result = result.data;
          $scope.stop();
          promise = $interval(watch, 60000);
      });
    }

  }

  angular
    .module('beanware.data.controllers')
    .controller('AdminController', AdminController);

  AdminController.$inject = ['$location', '$scope', '$http', 'Authentication', '$route'];

  function AdminController($location, $scope, $http, Authentication, $route) {

    $scope.slackError = false;
    $scope.jiraError = false;
    $scope.slackData = null;
    $scope.jiraData = null;
    $scope.authenticated = Authentication.isAuthenticated();

    $scope.submitSlackEvent = function () {
      if (!$scope.slackData) {
        $scope.slackError = true;
      }
      else {
        $scope.slackError = false;
        post_data($scope.slackData, 'slack');
        $scope.reload();
      }
    }

    $scope.submitJiraEvent = function () {
      if (!$scope.jiraData) {
        $scope.jiraError = true;
      }
      else {
        $scope.jiraError = false;
        post_data($scope.jiraData, 'jira');
        $scope.reload();
      }
    }

    function apiRequest(data) {
      return $http({
        method: data.requestType,
        url: data.requestUrl,
        headers: data.headers,
        data: data.requestData
      })
    };

    function post_data(eventData, eventType) {
      var data = {};
      data.requestType = 'POST';
      data.requestUrl = 'event_data/';
      data.requestData = {
        'data': JSON.parse(JSON.stringify(eventData)),
        'type': eventType
      }

      apiRequest(data).then(
        function(result){
      });
    };

    $scope.reload = function () {
      $route.reload();
    }

  }

})();
