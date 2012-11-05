// Generated by CoffeeScript 1.4.0
(function() {
  var app;

  Array.prototype.shuffle = function() {
    return this.sort(function() {
      return 0.5 - Math.random();
    });
  };

  app = angular.module('hitrewitre', []);

  app.controller("GameCtrl", function($scope) {
    $scope.money = 50;
    $scope.wager = 10;
    $scope.cards = [
      {
        "name": "Q Spade",
        "points": 0
      }, {
        "name": "Q Hearts",
        "points": 1
      }, {
        "name": "Q Clubs",
        "points": 0
      }
    ].shuffle();
    $scope.pickCard = function() {
      if (this.card.points > 0) {
        $scope.money += $scope.wager;
      } else {
        $scope.money -= $scope.wager;
      }
      if ($scope.money < 0) {
        $scope.money = 0;
      }
      return $scope.cards.shuffle();
    };
    return $scope.drawCard = function() {
      return this;
    };
  });

  angular.bootstrap(document, ["hitrewitre"]);

}).call(this);
