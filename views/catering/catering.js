'use strict';

angular.module('myApp.catering', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/catering', {
    templateUrl: 'views/catering/catering.html',
    controller: 'CateringCtrl'
  });
}])

.controller('CateringCtrl', function($scope){

  $scope.tags = "";
  $scope.filterList = [];

  $scope.toggleFromFilterList = function(name) {
    if ($scope.filterList.includes(name)) {
      var index = $scope.filterList.indexOf(name);
      $scope.filterList.splice(index, 1);
    } else {
      $scope.filterList.push(name);
    }
    $scope.tags = $scope.filterList.toString();
  }

  $scope.tag = function(item) {
      if ($scope.tags) {
        return $scope.tags.replace(/\s*,\s*/g, ',').split(',').every(function(tag) {
          return item.tags.some(function(objTag){
            return objTag.indexOf(tag) !== -1;
          });
        });
      }
      else {
        return true;
      }
  };

  $scope.menu = [
    {
      "name": "Falafel",
      "desc": "Fresh falafel home made from scratch",
      "price": 9,
      "tags": ["hot", "vegetarian"]
    },
    {
      "name": "Salad",
      "desc": "Fresh salad home made from scratch",
      "price": 7,
      "tags": ["cold", "vegetarian"]
    },
    {
      "name": "Chicken",
      "desc": "Fresh portion of chicken",
      "price": 6,
      "tags": ["hot", "meat"]
    }
  ];

});