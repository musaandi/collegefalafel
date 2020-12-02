'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$http', function($http) {
  $http.get("https://collegefalafel-api.herokuapp.com/")
    .then(
      function (res) { console.log('API Status: ' + res.data) },
      function (err) {}
    );
}]);