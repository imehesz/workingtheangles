Array::shuffle = -> @sort -> 0.5 - Math.random()

app = angular.module 'hitrewitre', []

app.controller "GameCtrl", ($scope) ->
  $scope.money = 50
  $scope.wager = 10

  $scope.cards = [ {"name":"Q Spade","points":0},{"name":"Q Hearts","points":1},{"name":"Q Clubs","points":0} ].shuffle()

  $scope.pickCard = ->
    if @.card.points > 0
      $scope.money += $scope.wager
    else
      $scope.money -= $scope.wager

    if $scope.money < 0
      $scope.money = 0

    $scope.cards.shuffle()

  $scope.drawCard = ->
    @

angular.bootstrap document, ["hitrewitre"]
