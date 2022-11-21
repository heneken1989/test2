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
      .when("/", {
        templateUrl: "../..//Page/customAerobic.html",
        controller: "ctrlAerobic",
      })
      .when("/login", {
        templateUrl: "../Page/login.html",
        controller: "ctrlLogin",
      })
      .when("/displayDataLocal", {
        templateUrl: "../Page/displayDataLocal.html",
        controller: "ctrlLogin",
      })
      .when("/", {
        templateUrl: "../Page/customAerobic.html",
        controller: "customCtrl",
      });
  },
]);

app.controller("ctrlAerobic", function ($scope) {
  //   ------------
  // -----------------------------------------------------------------
});

app.controller("HeaderFooter", function ($scope) {
  $(document).ready(function () {
    $(window).scroll(function () {
      if ($(window).scrollTop() >= 30) {
        $(".nav-bar").addClass("fixed-header");
        $("header .logo").addClass("headerLogoTransition");
        $(".logo").css("display", "none");
        $(".logoAdd").css("display", "block");
        $(".menu-icon").css("top", "-85px");
      } else {
        $(".nav-bar").removeClass("fixed-header");
        $(".logoAdd").css("display", "none");
        $("header .logo").removeClass("headerLogoTransition");
        $(".logo").css("display", "block");
        $(".menu-icon").css("top", "0px");
      }
    });
  });
  // =====================================
});
app.run(function ($rootScope, $http) {
  $http.get("../JSON/product.json").then(function (rsp) {
    $rootScope.products = rsp.data.product;
    $rootScope.listPractice = [];
    $rootScope.saveValue = [];
  });
});

