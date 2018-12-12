'use strict';

angular.module('myApp.catering', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/catering', {
    templateUrl: 'views/catering/catering.html',
    controller: 'CateringCtrl'
  });
}])

.controller('CateringCtrl', ["$scope", "$http", function($scope, $http){

  $scope.tags = "";
  $scope.filterList = [];
  $scope.faq = false;
  $scope.platterCategory = "protein";

  $scope.showSummary = false;

  $scope.showSection = 'premade';

  $scope.custom = {
    name: "Custom Platter",
    items: [],
    specialRequest: "",
    serving: 1,
    price: 0
  };

  $scope.items = [
    { category: "protein", name: "meat: chicken", price: 6.99 },
    { category: "protein", name: "meat: beef", price: 7.99 },
    { category: "protein", name: "meat: donair", price: 7.99 },
    { category: "protein", name: "meat: lamb", price: 8.99 },
    { category: "protein", name: "veg: 3 falafel balls", price: 4.50 },
    { category: "protein", name: "veg: stuffed eggplant", price: 7.99 },
    { category: "protein", name: "veg: stuffed pepper", price: 7.99 },
    { category: "sides", name: "pita", price: 1.00 },
    { category: "sides", name: "salads", price: 6.99 },
    { category: "sides", name: "dips (hummus, tzatziki/garlic dip, tahini, hot sauce)", price: 6.99 },
    { category: "sides", name: "chicken samousa", price: 2.99 },
    { category: "sides", name: "beef samousa", price: 2.99 },
    { category: "sides", name: "vege samousa", price: 2.99 },
    { category: "desserts", name: "2 finger baklava", price: 4.99 },
    { category: "desserts", name: "1 triangle", price: 3.99 },
    { category: "desserts", name: "2 cookies", price: 3.99 },
    { category: "desserts", name: "1 almond cake", price: 2.99 }
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

  $scope.orderSummary = {};

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
        details += "(x" + item.quantity + ") $" + item.price + " - " + item.name;
        if (item.desc != "") {
          details += ": " + item.desc;
        }
        if (item.specialRequest) {
          details += " [ " + item.specialRequest + " ]";
        }
        details += "####";
      });

      if ($scope.orderSummary.specialRequest == "") {
        $scope.orderSummary.specialRequest = "No additional special requests.";
      }

      var payload = {
        type: "catering",
        name: $scope.orderSummary.name,
        phone: $scope.orderSummary.phone,
        email: $scope.orderSummary.email,
        specialRequest: $scope.orderSummary.specialRequest,
        details: details,
        subtotal: Math.round($scope.orderSummary.total * 100) / 100,
        tax: Math.round($scope.orderSummary.total * 0.13 * 100) / 100,
        total: Math.round($scope.orderSummary.total * 1.13 * 100) / 100,
        timestamp: timestamp.toString(),
        orderId: generateOrderId(timestamp)
      }

      $http.post("http://collegefalafel.com/api/v1/mailer.php", payload)
      .then(function(res){
        alert("Thank you for submitting your order with orderId: '" + payload.orderId + "'. We will contact you shortly to confirm your order. All payment transactions are handled over the phone.")
        $scope.resetOrder();
        window.location.reload();
      }, function(err){
        alert("Could not submit order, there was an error reaching the server.");
      });
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

  $scope.removeFromOrder = function(id) {
    if (confirm("Are you sure you want to remove the item from your order?")) {
      var toDelete = null;
      var name;
      var desc;
      $scope.orderSummary.items.forEach(function(item, index){
        if (item.id === id) {
          toDelete = index;
        }
      });
      if (toDelete !== null) {
        name = $scope.orderSummary.items[toDelete].name;
        desc = $scope.orderSummary.items[toDelete].desc;
        $scope.orderSummary.items.splice(toDelete, 1);
      }
      $scope.updateTotals();
      $scope.updateQuantities(name, desc, 0);
      $scope.updateBulkQuantities(name, desc, 0);
    }
  }

  $scope.updateTotals = function() {
    var total = 0;
    $scope.orderSummary.items.forEach(function(item){
      total += item.price * item.quantity;
    });
    $scope.orderSummary.total = total;
    window.localStorage.orderSummary = JSON.stringify($scope.orderSummary);
  }

  $scope.updateQuantities = function(name, desc, quantity) {
    $scope.premadePlatters.forEach(function(item){
      if (item.name == name && item.desc == desc) {
        item.quantity = quantity;
      }
    })
  }

  $scope.addPlatter = function(platter) {
    var exists;
    $scope.orderSummary.items.forEach(function(item, index){
      if (item.name === platter.name) {
        exists = index;
      }
    });
    if (exists > -1) {
      $scope.orderSummary.items[exists].quantity += 1;
      $scope.updateQuantities(platter.name, platter.desc, $scope.orderSummary.items[exists].quantity);
    } else {
      var obj = {
        id: $scope.orderSummary.items.length + 1,
        name: platter.name,
        desc: platter.desc,
        price: platter.price,
        edit: false,
        quantity: 1,
        specialRequest: platter.specialRequest
      }
      $scope.orderSummary.items.push(obj);
      $scope.updateQuantities(platter.name, platter.desc, 1);
    }
    $scope.updateTotals();
  }

  $scope.reduceFromOrder = function(name, desc) {
    var toDelete = null;
    $scope.orderSummary.items.forEach(function(item, index){
      if (item.name === name && item.desc === desc) {
        toDelete = index;
      }
    });
    if (toDelete !== null) {
      if ($scope.orderSummary.items[toDelete].quantity == 1) {
        $scope.orderSummary.items.splice(toDelete, 1);
        $scope.updateQuantities(name, desc, 0);
        $scope.updateBulkQuantities(name, desc, 0);
      } else {
        $scope.orderSummary.items[toDelete].quantity -= 1;
        $scope.updateQuantities(name, desc, $scope.orderSummary.items[toDelete].quantity);
        $scope.updateBulkQuantities(name, desc, $scope.orderSummary.items[toDelete].quantity);
      }
    }
    $scope.updateTotals();
  }

  function getDesc(items) {
    var out = "";
    var buffer = [];

    items.forEach(function(item){
      var notFound = true;
      buffer.forEach(function(bufferItem){
        if (item.name == bufferItem.name) {
          notFound = false;
        }
      })
      if (notFound) {
        buffer.push({
          name: item.name,
          quantity: 0
        })
      }
    })

    items.forEach(function(item){
      buffer.forEach(function(bufferItem){
        if (item.name == bufferItem.name) {
          bufferItem.quantity += 1;
        }
      })
    })

    buffer.forEach(function(bufferItem){
      if (bufferItem.quantity > 1) {
        out += ", " + bufferItem.name + " (x" + bufferItem.quantity + ")";
      } else {
        out += ", " + bufferItem.name;
      }
    })

    return out.substring(1);
  }

  $scope.confirmAndAddToOrder = function(customPlatter) {
    if (customPlatter.items.length > 0) {
      customPlatter.desc = getDesc(customPlatter.items);

      var exists;
      $scope.orderSummary.items.forEach(function(item, index){
        if (item.desc === customPlatter.desc && item.name === customPlatter.name) {
          exists = index;
        }
      });
      if (exists > -1) {
        $scope.orderSummary.items[exists].quantity += 1;
      } else {
        var obj = {
          id: $scope.orderSummary.items.length + 1,
          name: customPlatter.name,
          desc: customPlatter.desc + " for " + customPlatter.serving + " people",
          price: customPlatter.price * customPlatter.serving,
          edit: false,
          quantity: 1,
          specialRequest: customPlatter.specialRequest
        }
        $scope.orderSummary.items.push(obj);
        alert("Your custom platter '" + customPlatter.name + "' was added to your order.");
      }
      $scope.updateTotals();
    }
  }

  $scope.resetCustomPlatter = function() {
    $scope.custom = {
      name: "Custom Platter",
      items: [],
      specialRequest: "",
      serving: 1,
      price: 0
    };
  }

  $scope.premadePlatters = [
    {
      name: "Chicken Platter",
      desc: "Includes chicken, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 119.92,
      quantity: 0
    },
    {
      name: "Beef Platter",
      desc: "Includes beef, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 119.92,
      quantity: 0
    },
    {
      name: "Donair Platter",
      desc: "Includes donair, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 119.92,
      quantity: 0
    },
    {
      name: "Lamb Platter",
      desc: "Includes lamb, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 127.92,
      quantity: 0
    },
    {
      name: "Vegetarian Falafel Platter",
      desc: "Includes falafel balls, vegetable samousa, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 119.92,
      quantity: 0
    },
    {
      name: "Vegetarian Stuffed Eggplant Platter",
      desc: "Includes stuffed eggplant, vegetable samousa, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 119.92,
      quantity: 0
    },
    {
      name: "Vegetarian Stuffed Pepper Platter",
      desc: "Includes stuffed pepper, vegetable samousa, dips (hummus, tzatziki/garlic dip, tahini, hot sauce), salads, rice with mixed vegetables and curried potatoes for 8 people.",
      price: 119.92,
      quantity: 0
    },
    {
      name: "Assorted Dessert Platter",
      desc: "Includes finger baklava, triangle baklava, cookies and almond cake for 8 people.",
      price: 124,
      quantity: 0
    },
    {
      name: "Finger Baklava Dessert Platter",
      desc: "Includes finger baklava for 8 people. (1 for each person)",
      price: 15.92,
      quantity: 0
    },
    {
      name: "Triangle Baklava Dessert Platter",
      desc: "Includes triangle baklava for 8 people. (1 for each person)",
      price: 31.92,
      quantity: 0
    },
  ];

  $scope.bulkItemFilter = "sandwiches";

  $scope.updateBulkQuantities = function(name, desc, quantity) {
    $scope.bulkItems.forEach(function(item){
      if (item.name == name && item.desc == desc) {
        item.quantity = quantity;
      }
    })
  }

  $scope.addBulkItem = function(bulkItem) {
    var exists;
    $scope.orderSummary.items.forEach(function(item, index){
      if (item.name === bulkItem.name) {
        exists = index;
      }
    });
    if (exists > -1) {
      $scope.orderSummary.items[exists].quantity += 1;
      $scope.updateBulkQuantities(bulkItem.name, "", $scope.orderSummary.items[exists].quantity);
    } else {
      var obj = {
        id: $scope.orderSummary.items.length + 1,
        name: bulkItem.name,
        desc: "",
        price: bulkItem.price,
        edit: false,
        quantity: 1,
        specialRequest: bulkItem.specialRequest
      }
      $scope.orderSummary.items.push(obj);
      $scope.updateBulkQuantities(bulkItem.name, "", 1);
    }
    $scope.updateTotals();
  }

  $scope.removeBulkItem = function(bulkItem) {
    var toDelete = null;
    $scope.orderSummary.items.forEach(function(item, index){
      if (item.name === bulkItem.name) {
        toDelete = index;
      }
    });
    if (toDelete !== null) {
      if ($scope.orderSummary.items[toDelete].quantity == 1) {
        $scope.orderSummary.items.splice(toDelete, 1);
        $scope.updateBulkQuantities(bulkItem.name, "", 0);
      } else {
        $scope.orderSummary.items[toDelete].quantity -= 1;
        $scope.updateBulkQuantities(bulkItem.name, "", $scope.orderSummary.items[toDelete].quantity);
      }
    }
    $scope.updateTotals();
  }

  $scope.bulkItems = [

    // Sandwiches
    {
      name: "East Coast Donair Sandwich",
      desc: "",
      category: "sandwiches",
      price: 9.99,
      quantity: 0
    },
    {
      name: "Chicken Shawarma Sandwich",
      desc: "",
      category: "sandwiches",
      price: 8.99,
      quantity: 0
    },
    {
      name: "Beef Shawarma Sandwich",
      desc: "",
      category: "sandwiches",
      price: 9.99,
      quantity: 0
    },
    {
      name: "Lamb Shawarma Sandwich",
      desc: "",
      category: "sandwiches",
      price: 10.99,
      quantity: 0
    },
    {
      name: "Chicken Breast Kebab Sandwich",
      desc: "",
      category: "sandwiches",
      price: 9.99,
      quantity: 0
    },
    {
      name: "Veal Liver Sandwich",
      desc: "",
      category: "sandwiches",
      price: 9.99,
      quantity: 0
    },
    {
      name: "Kefta Burger Sandwich",
      desc: "",
      category: "sandwiches",
      price: 9.99,
      quantity: 0
    },
    {
      name: "Falafel Sandwich",
      desc: "",
      category: "sandwiches",
      price: 7.99,
      quantity: 0
    },
    {
      name: "Vegetarian Sandwich",
      desc: "",
      category: "sandwiches",
      price: 8.99,
      quantity: 0
    },
    {
      name: "Fish Fillet Sandwich",
      desc: "",
      category: "sandwiches",
      price: 10.99,
      quantity: 0
    },
    {
      name: "Breakfast Sandwich",
      desc: "",
      category: "sandwiches",
      price: 8.99,
      quantity: 0
    },

    // Plates
    {
      name: "Donair (East Coast) Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Chicken Shawarma Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Beef Shawarma Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Lamb Shawarma Plate",
      desc: "",
      category: "plates",
      price: 15.99,
      quantity: 0
    },
    {
      name: "Chicken Breast Kebab Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Veal Liver Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Kefta Burger Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Falafel Plate",
      desc: "",
      category: "plates",
      price: 13.99,
      quantity: 0
    },
    {
      name: "Vegetarian Plate",
      desc: "",
      category: "plates",
      price: 14.99,
      quantity: 0
    },
    {
      name: "Fish Fillet Plate",
      desc: "",
      category: "plates",
      price: 15.99,
      quantity: 0
    },
    {
      name: "Shrimp Plate",
      desc: "",
      category: "plates",
      price: 15.99,
      quantity: 0
    },

    // Sides
    {
      name: "Spinach Pie",
      desc: "",
      category: "sides",
      price: 3.99,
      quantity: 0
    },
    {
      name: "Cheese Pie",
      desc: "",
      category: "sides",
      price: 3.99,
      quantity: 0
    },
    {
      name: "Leek Roll",
      desc: "",
      category: "sides",
      price: 2.99,
      quantity: 0
    },
    {
      name: "Chicken Samousa",
      desc: "",
      category: "sides",
      price: 2.99,
      quantity: 0
    },
    {
      name: "Beef Samousa",
      desc: "",
      category: "sides",
      price: 2.99,
      quantity: 0
    },
    {
      name: "Vegetarian Samousa",
      desc: "",
      category: "sides",
      price: 2.99,
      quantity: 0
    },
    {
      name: "Grape Vine Roll (GF)",
      desc: "",
      category: "sides",
      price: 1.99,
      quantity: 0
    },
    {
      name: "Hummus (GF)",
      desc: "",
      category: "sides",
      price: 6.99,
      quantity: 0
    },
    {
      name: "Stuffed Eggplant (GF)",
      desc: "",
      category: "sides",
      price: 7.99,
      quantity: 0
    },
    {
      name: "Stuffed Pepper (GF)",
      desc: "",
      category: "sides",
      price: 7.99,
      quantity: 0
    },
    {
      name: "Falafel Ball (GF)",
      desc: "",
      category: "sides",
      price: 1.50,
      quantity: 0
    },
    {
      name: "Curried Potatoes (GF)",
      desc: "",
      category: "sides",
      price: 5.99,
      quantity: 0
    },
    {
      name: "Curried Rice with Mixed Vegetables (GF)",
      desc: "",
      category: "sides",
      price: 5.99,
      quantity: 0
    },
    {
      name: "Fresh Cut Fries (GF)",
      desc: "",
      category: "sides",
      price: 5.99,
      quantity: 0
    },
    {
      name: "Lentil Soup (GF)",
      desc: "",
      category: "sides",
      price: 5.99,
      quantity: 0
    },
    {
      name: "Chickpea Salad (GF)",
      desc: "",
      category: "sides",
      price: 6.99,
      quantity: 0
    },
    {
      name: "Tabouli Salad",
      desc: "",
      category: "sides",
      price: 6.99,
      quantity: 0
    },
    {
      name: "Mediterranean Salad",
      desc: "",
      category: "sides",
      price: 6.99,
      quantity: 0
    },

    // Desserts
    {
      name: "Rice Pudding (GF)",
      desc: "",
      category: "desserts",
      price: 3.99,
      quantity: 0
    },
    {
      name: "Triangle Baklava",
      desc: "",
      category: "desserts",
      price: 3.99,
      quantity: 0
    },
    {
      name: "Finger Baklava",
      desc: "",
      category: "desserts",
      price: 2.99,
      quantity: 0
    },
    {
      name: "Almond Cookie ",
      desc: "",
      category: "desserts",
      price: 1.99,
      quantity: 0
    },
    {
      name: "Honey Nut Cookie",
      desc: "",
      category: "desserts",
      price: 1.99,
      quantity: 0
    },
    {
      name: "Almond Cake",
      desc: "",
      category: "desserts",
      price: 2.99,
      quantity: 0
    },

    // Drinks
    {
      name: "Mango Juice (473mL Bottle)",
      desc: "",
      category: "drinks",
      price: 3.29,
      quantity: 0
    },
    {
      name: "Water (600mL Bottle)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    },
    {
      name: "Chocolate Milk (237mL Carton)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    },
    {
      name: "Chocolate Milk (473mL Carton)",
      desc: "",
      category: "drinks",
      price: 2.89,
      quantity: 0
    },
    {
      name: "San Pellegrino (330mL Can)",
      desc: "",
      category: "drinks",
      price: 2.89,
      quantity: 0
    },
    {
      name: "Sumol (330mL Can)",
      desc: "",
      category: "drinks",
      price: 2.89,
      quantity: 0
    },
    {
      name: "Coca Cola (335mL Can)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    },
    {
      name: "Diet Coke (335mL Can)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    },
    {
      name: "Canada Dry (335mL Can)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    },
    {
      name: "Nestea (335mL Can)",
      desc: "",
      category: "drinks",
      price: 2.20,
      quantity: 0
    },
    {
      name: "Sprite (335mL Can)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    },
    {
      name: "Compal (200mL Bottle)",
      desc: "",
      category: "drinks",
      price: 1.89,
      quantity: 0
    }
  ]

  $scope.updateAllQuantities = function() {
    $scope.orderSummary.items.forEach(function(item){
      $scope.updateQuantities(item.name, item.desc, item.quantity);
      $scope.updateBulkQuantities(item.name, item.desc, item.quantity);
    })
  }

  if (window.localStorage.orderSummary != null) {
    $scope.orderSummary = JSON.parse(window.localStorage.orderSummary);
    $scope.updateAllQuantities();
  } else {
    $scope.orderSummary = {
      name: "",
      phone: "",
      email: "",
      specialRequest: "",
      items: [],
      total: null,
    }
  }

  $scope.saveData = function() {
    window.localStorage.orderSummary = JSON.stringify($scope.orderSummary);
  }

  $scope.resetOrder = function() {
    if (confirm("Clear your order?")) {
      $scope.orderSummary = {
        name: $scope.orderSummary.name,
        phone: $scope.orderSummary.phone,
        email: $scope.orderSummary.email,
        specialRequest: "",
        items: [],
        total: null,
      }
      $scope.saveData();
      window.location.reload();
    }
  }

}]);