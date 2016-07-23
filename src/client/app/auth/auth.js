angular.module('battle.auth', [])

.controller('AuthController', [ '$scope', '$window', '$location', 'Auth', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (response) {
        var token = response.data.token;
        if (token) {
          $window.localStorage.setItem('nuggets', token);
          $location.path('home');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function () {
        $location.path('/signin');
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  $scope.signout = function () {
    Auth.signout();
  };

  $scope.authed = function () {
    return Auth.authed();
  };
}]);
