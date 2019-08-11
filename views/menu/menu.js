'use strict';

angular.module('myApp.menu', ['ngRoute'])

.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 20;
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/menu', {
    templateUrl: 'views/menu/menu.html',
    controller: 'MenuCtrl'
  });
}])

.controller('MenuCtrl', ['$scope', '$location', '$anchorScroll', 'menuService', function($scope, $location, $anchorScroll, menuService) {

  $('[data-toggle="tooltip"]').tooltip();

  $scope.scrollTo = function(id) {
    $location.hash(id);
    console.log($location.hash());
    $anchorScroll();
  };

  $scope.menu = menuService.getMenu();

}]);