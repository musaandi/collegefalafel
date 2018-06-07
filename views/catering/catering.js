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
  $scope.faq = false;

  $scope.showSection = 'bulk';

  $scope.custom = {
    name: "Custom Platter",
    items: [],
    specialRequest: "",
    price: 0
  };

  $scope.items = [
    { name: "meat: chicken", price: 6 },
    { name: "meat: beef", price: 7 },
    { name: "meat: donair", price: 7 },
    { name: "meat: lamb", price: 8 },
    { name: "veg: 3 falafel balls", price: 4.50 },
    { name: "veg: stuffed eggplant", price: 7 },
    { name: "veg: stuffed pepper", price: 7 },
    { name: "pita", price: 1 },
    { name: "salads", price: 6 },
    { name: "dips (hummus, tzatziki/garlic dip, tahini, hot sauce)", price: 3 },
    { name: "samousa", price: 2 },
    { name: "2 finger baklava", price: 4 },
    { name: "1 triangle", price: 3.50 },
    { name: "2 cookies", price: 3 },
    { name: "1 almond cake", price: 2 }
  ]

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

  $scope.updateCustomTotals = function() {
    var total = 0;
    $scope.custom.items.forEach(function(item){
      total += item.price;
    });
    $scope.custom.price = total;
  }

  $scope.addToCustomPlatter = function(item) {
    var payload = {
      name: item.name,
      price: item.price,
      id: $scope.custom.items.length + 1
    };
    $scope.custom.items.push(payload);
    $scope.updateCustomTotals();
  }

  $scope.removeFromCustomPlatter = function(id) {
    if (confirm("Are you sure you want to remove the item from your custom platter?")) {
      var toDelete = null;
      $scope.custom.items.forEach(function(item, index){
        if (item.id === id) {
          toDelete = index;
        }
      });
      if (toDelete !== null) {
        $scope.custom.items.splice(toDelete, 1);
      }
      $scope.updateCustomTotals();
    }
  }

  $scope.orderSummary = {
    name: "",
    phone: "",
    email: "",
    specialRequest: "",
    items: [],
    total: null,
  }

  function orderIsValid() {
    var isValid = true;

    if ($scope.orderSummary.name.length < 1) isValid = false;
    if ($scope.orderSummary.phone.length < 1) isValid = false;
    if (!$scope.orderSummary.email) isValid = false;
    if ($scope.orderSummary.items.length < 1) isValid = false;

    return isValid;
  }

  $scope.submitOrder = function() {
    if (orderIsValid()) {
      var details = "";
      var timestamp = new Date();

      $scope.orderSummary.items.forEach(function(item){
        details += "\nPlatter: " + item.name;
        details += "\nContents: " + item.desc;
        details += "\nPrice: $" + item.price;
        if (item.specialRequest) {
          details += "\nSpecial Request: " + item.specialRequest;
        }
        details += "\n---";
      });

      var payload = {
        type: "catering",
        name: $scope.orderSummary.name,
        phone: $scope.orderSummary.phone,
        email: $scope.orderSummary.email,
        details: details,
        total: $scope.orderSummary.total,
        timestamp: timestamp.toString(),
        orderId: generateOrderId(timestamp)
      }

      // $http.post("http://collegefalafel.com/api/v1/mailer.php", payload);
      console.log(payload);
    } else {
      alert("Could not submit order, you are missing some fields.");
    }
  }

  function generateOrderId(timestamp) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text + timestamp.toISOString().substring(0, 10);
  }


  $scope.addToOrder = function(item) {
    $scope.order.items.push(item);
    $scope.updateTotals();
  }

  $scope.removeFromOrder = function(id) {
    if (confirm("Are you sure you want to remove the item from your order?")) {
      var toDelete = null;
      $scope.orderSummary.items.forEach(function(item, index){
        if (item.id === id) {
          toDelete = index;
        }
      });
      if (toDelete !== null) {
        $scope.orderSummary.items.splice(toDelete, 1);
      }
      $scope.updateTotals();
    }
  }

  $scope.updateTotals = function() {
    var total = 0;
    $scope.orderSummary.items.forEach(function(item){
      total += item.price;
    });
    $scope.orderSummary.total = total;
  }

  $scope.addPlatter = function(platter) {
    var obj = {
      id: $scope.orderSummary.items.length + 1,
      name: platter.name,
      desc: platter.desc,
      price: platter.price,
      edit: false,
      specialRequest: platter.specialRequest
    }
    $scope.orderSummary.items.push(obj);
    $scope.updateTotals();
  }

  $scope.confirmAndAddToOrder = function(customPlatter) {
    if (customPlatter.items.length > 0) {
      var desc = "";

      customPlatter.items.forEach(function(item){
        desc += ", " + item.name;
      })

      desc = desc.substring(1);

      var obj = {
        id: $scope.orderSummary.items.length + 1,
        name: customPlatter.name,
        desc: desc,
        price: customPlatter.price,
        edit: false,
        specialRequest: customPlatter.specialRequest
      }
      $scope.orderSummary.items.push(obj);
      $scope.updateTotals();
    }
  }

  $scope.premadePlatters = [
    {
      name: "Chicken Platter",
      desc: "Includes chicken, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), pita, salads",
      price: 16,
    },
    {
      name: "Beef Platter",
      desc: "Includes beef, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), pita, salads",
      price: 17,
    },
    {
      name: "Donair Platter",
      desc: "Includes donair, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), pita, salads",
      price: 17,
    },
    {
      name: "Lamb Platter",
      desc: "Includes lamb, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), pita, salads",
      price: 18,
    },
    {
      name: "Vegetarian Falafel Platter",
      desc: "Includes falafel balls, vegetable samousa, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, pita",
      price: 16.50,
    },
    {
      name: "Vegetarian Stuffed Eggplant Platter",
      desc: "Includes stuffed eggplant, vegetable samousa, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, pita",
      price: 19,
    },
    {
      name: "Vegetarian Stuffed Pepper Platter",
      desc: "Includes stuffed pepper, vegetable samousa, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, pita",
      price: 19,
    },
    {
      name: "Assorted Dessert Platter",
      desc: "Includes 2 finger baklava, 1 triangle baklava, 2 cookies and 1 almond cake",
      price: 15.50,
    },
    {
      name: "Finger Baklava Dessert Platter",
      desc: "Includes 5 finger baklava",
      price: 10,
    },
    {
      name: "Triangle Baklava Dessert Platter",
      desc: "Includes finger baklava, triangle baklava, cookies, almond cake, rice pudding",
      price: 17.50,
    },
  ];

});