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

      })
      .when("/login", {
        templateUrl: "../Page/login.html",
        controller: "ctrlLogin",
      })
      .when("/displayDataLocal", {
        templateUrl: "../Page/displayDataLocal.html",
        controller: "ctrlLogin",
      })

  },
]);


