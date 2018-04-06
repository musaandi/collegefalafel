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

  $scope.order = {
    items: [],
    subTotal: null,
    total: null,
    specialRequest: ""
  }

  $scope.addToOrder = function(item) {
    $scope.order.items.push(item);
    $scope.updateTotals();
  }

  $scope.removeFromOrder = function(id) {
    var toDelete = null;
    $scope.order.items.forEach(function(item, index){
      if (item.id == id) {
        toDelete = index;
      }
    });
    if (toDelete) {
      $scope.order.items.splice(index, 1);
    }
    $scope.updateTotals();
  }

  $scope.updateTotals = function() {
    var orderItems = $scope.order.items;
    var subTotal = 0;
    orderItems.forEach(function(item){
      subTotal += item.price;
    })
    $scope.order.subTotal = subTotal;
    $scope.order.total = subTotal * 1.13;
  }

  $scope.menu = [
    {
      "id": 0,
      "name": "Falafel",
      "desc": "Fresh falafel home made from scratch",
      "price": 9,
      "tags": ["hot", "vegetarian"]
    },
    {
      "id": 1,
      "name": "Salad",
      "desc": "Fresh salad home made from scratch",
      "price": 7,
      "tags": ["cold", "vegetarian"]
    },
    {
      "id": 2,
      "name": "Chicken",
      "desc": "Fresh portion of chicken",
      "price": 6,
      "tags": ["hot", "meat"]
    }
  ];

});