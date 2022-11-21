var app = angular.module("myApp", [
  "ngRoute",
  "ngSanitize",
  "dndLists",
  "ngMessages",
]);
app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("", { templateUrl: "./Page/home.html" })
      .when("/problem", { templateUrl: "../Page/problem.html" })
      .when("/meditation", { templateUrl: "../Page/meditation.html" })
  };
]);


