app = angular.module 'twentyone', []

app.controller "GameCtrl", ($scope) ->
  $scope.demo = "It is working, just need to manually bootstrap the app"

angular.bootstrap document, ["twentyone"]
