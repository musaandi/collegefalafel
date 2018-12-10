'use strict';

angular.module('myApp.catering-info', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/catering-info', {
    templateUrl: 'views/catering-info/catering-info.html',
    controller: 'CateringInfoCtrl'
  });
}])

.controller('CateringInfoCtrl', ["$scope", "$http", function($scope, $http){


}]);