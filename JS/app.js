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

app.controller("product", [
  "$scope",
  "$rootScope",
  function ($scope, $rootScope) {
    $rootScope.itemCheck = 0;

    $scope.preview = function (imgP) {
      $rootScope.text = imgP.texts;

      for (var i in $rootScope.products) {
        if ($rootScope.products[i].id == imgP.id) {
          var index = parseInt(i);
        }
      }
      $rootScope.itemCheck = index;
    };

    // -----------------
    $scope.selectedCategory = "";

    $scope.category = Object.keys(
      $rootScope.products.reduce(function (categoryMap, product) {
        categoryMap[product.category] = 0;

        return categoryMap;
      }, {})
    );

    $scope.setFilterCategory = function (value) {
      $scope.selectedCategory = value;
    };
    $scope.setFilterAll = function () {
      $scope.selectedCategory = "";
    };
    // ---------------------------------
    $scope.filterByCategory = function (item) {
      // console.log($scope.selectedCategory)
      if ($scope.selectedCategory)
        return $scope.selectedCategory == item.category;
      else return $rootScope.products;
    };

    $scope.del = function (item) {
      var flagCount = 1;
      var flag = false;
      var index = $rootScope.listPractice.indexOf(item);
      $rootScope.listPractice.splice(index, 1);

      $scope.total(flag, flagCount);
    };
  },
]);
app.controller("timer-list", function () {
  function displayCart() {
    $(document).ready(function () {
      var array = JSON.parse(localStorage.getItem("arrayList"));
      // alert(array);
      var outputSound = `<source
            id="hiddenoth-1"
            src="./Page/audio/get-ready.mp3"
            type="audio/mpeg"
          />
          <source
            id="hiddenoth-2"
            src="./Page/audio/workout-complete.mp3"
            type="audio/mpeg"
          />
          <source id="hiddenoth-3" src="./Page/audio/" type="audio/mpeg" />
          <source
            id="hiddenoth-4"
            src="./Page/audio/rest.mp3"
            type="audio/mpeg"
          />
          <source
            id="hiddenbeep-hidden"
            src="./Page/audio/beep.mp3"
            type="audio/mpeg"
          />
          <source
            id="three-beep"
            src="./Page/audio/threebeep.mp3"
            type="audio/mpeg"
          />`;
      $.each(array, function (k, v) {
        outputSound += `<source
            id="hiddenex-${k + 1}"
            src="./Page/audio/${v.name}.mp3"
            type="audio/mpeg"
          />`;
      });
      var outputListPractice = ` `;
      $.each(array, function (k, v) {
        outputListPractice += `<div class="timer-list-item">${v.name}
              <input
                type="hidden"
                class="gif"
                value="${v.name}.gif"
              /><input
                type="hidden"
                class="sound"
                value="${v.name}.mp3"
                name="ex-${k + 1}"
              /><input type="hidden" class="duration" value="${v.reps}" />
            </div>`;
      });
      $("#audio-sounds").html(outputSound);
      $(".timer-list").html(`<div class="timer-list-item active">
              get ready
              <input type="hidden" class="duration" value="5" />
              <input type="hidden" class="gif" value="get-ready.gif" />
              <input
                type="hidden"
                class="sound"
                name="oth-1"
                value="get-ready.mp3"
              />
            </div>
            ${outputListPractice}
            <div class="timer-list-item">
              rest<input type="hidden" class="duration" value="5" /><input
                type="hidden"
                class="gif"
                value="get-ready.jpg"
              /><input
                type="hidden"
                class="sound"
                name="oth-4"
                value="rest.mp3"
              />
            </div>
            ${outputListPractice}
            <div class="timer-list-item">
              workout complete<input
                type="hidden"
                class="duration"
                value="5"
              /><input type="hidden" class="gif" value="get-ready.jpg" /><input
                type="hidden"
                class="sound"
                name="oth-2"
                value="workout-complete.mp3"
              />
              </div>`);
    });
  }

  function timerPLay() {
    var inputIncrementTimer;
    var restartClicked = false;
    var sx = true;
    var tog = true;
    var newDispCreated = false;
    var toggledDiv = false;
    var prevGif = "";
    $(document).ready(function () {
      function IsAttrSupported(strTagName, strAttrName) {
        var blnVal = false;
        var elemInput = document.createElement(strTagName);
        if (strAttrName in elemInput) {
          blnVal = true;
        }
        delete elemInput;
        return blnVal;
      }

      $("div.interval-timer").each(function () {
        if ($(window).width() <= 600) {
          var newWidth = 200 - (600 - $(window).width()) / 4;
          $(this)
            .find("div.timer-countdown")
            .css({
              "font-size": newWidth + "px",
            });
        } else {
          $(this).find("div.timer-countdown").css({
            "font-size": "200px",
          });
        }
        var totalTimer, intervalTimer, startTime, functionalElapsed;
        var threeBeep = false;
        var thisTimer = this;
        var isSafari =
          navigator.vendor &&
          navigator.vendor.indexOf("Apple") > -1 &&
          navigator.userAgent &&
          !navigator.userAgent.match("CriOS");
        $(this)
          .find(".timer-menu .timer-next")
          .bind("mousedown", function (event) {
            var activeDuration = parseInt(
              $(thisTimer)
                .find(
                  "div.timer-menu div.timer-list div.timer-list-item.active input.duration"
                )
                .val()
            );
            var activeElapsed = parseInt(
              $(thisTimer).find("div.timer-countdown input.elapsed").val()
            );

            if (activeDuration - activeElapsed == 0) {
              $(thisTimer)
                .find("div.timer-menu div.timer-restart")
                .trigger("mousedown");
              event.preventDefault();
              event.stopPropagation();
              return false;
            }

            if ($(thisTimer).find("input.active").val() == 0) {
              startTime = new Date();
              functionalDifference = 0;
              intervalTimer = setInterval(function () {
                var now = new Date();
                var totalDifference = Math.round((now - startTime) / 1000);

                difference = totalDifference - functionalDifference;
                functionalDifference = difference + functionalDifference;

                var activeDuration = parseInt(
                  $(thisTimer)
                    .find(
                      "div.timer-menu div.timer-list div.timer-list-item.active input.duration"
                    )
                    .val()
                );
                var activeElapsed = parseInt(
                  $(thisTimer).find("div.timer-countdown input.elapsed").val()
                );

                $(thisTimer)
                  .find("div.timer-countdown")
                  .html(
                    ms(activeDuration - (activeElapsed + 1)) +
                      '<input type="hidden" class="elapsed" value="' +
                      (activeElapsed + difference) +
                      '" />'
                  );

                var totalElapsed =
                  parseInt(
                    $(thisTimer)
                      .find("div.timer-totals div.timer-elapsed input.elapsed")
                      .val()
                  ) + difference;
                $(thisTimer)
                  .find(
                    "div.timer-totals div.timer-elapsed div.timer-total-value"
                  )
                  .html(ms(totalElapsed));
                $(thisTimer)
                  .find("div.timer-totals div.timer-elapsed input.elapsed")
                  .val(totalElapsed);

                var totalRemaining =
                  parseInt(
                    $(thisTimer)
                      .find(
                        "div.timer-totals div.timer-remaining input.elapsed"
                      )
                      .val()
                  ) - difference;
                $(thisTimer)
                  .find(
                    "div.timer-totals div.timer-remaining div.timer-total-value"
                  )
                  .html(ms(totalRemaining));
                $(thisTimer)
                  .find("div.timer-totals div.timer-remaining input.elapsed")
                  .val(totalRemaining);

                if (activeDuration - (activeElapsed + 1) <= 0) {
                  var allIntervals = $(thisTimer).find(
                    "div.timer-menu div.timer-list-item"
                  );
                  var totalIntervals = allIntervals.length;
                  var thisInterval =
                    allIntervals.index(
                      $(thisTimer).find(
                        "div.timer-menu div.timer-list-item.active"
                      )
                    ) + 1;
                  if (thisInterval == totalIntervals) {
                    if (IsAttrSupported("audio", "autoplay")) {
                      player = $(thisTimer).find("#audio-sounds")[0];

                      player.src = $("#audio-sounds source#three-beep").attr(
                        "src"
                      );
                      player.play();
                    }
                    $(".curr-gif2").css("display", "none");
                    $(".curr-gif").css("display", "block");
                    $(".curr-gif").attr("src", "");
                    var initImg = $(".initImg").val();
                    $(".curr-gif").attr("src", "./Page/IMGS/" + initImg);
                    clearInterval(intervalTimer);
                    $(thisTimer).find("input.active").val("0");
                    $(thisTimer)
                      .find(".timer-menu .timer-next")
                      .html("&#x25Ba;");
                  } else {
                    threeBeep = true;
                    $(thisTimer)
                      .find(
                        "div.timer-menu div.timer-list div.timer-list-item.active"
                      )
                      .next()
                      .trigger("mousedown");
                  }
                }
              }, 1000);
              $(thisTimer).find("input.active").val("1");
              $(this).html("&#10074&#10074;");
            } else {
              clearInterval(intervalTimer);
              $(this).html("&#x25Ba;");
              $(thisTimer).find("input.active").val("0");
            }
            var tmpImg = $("div.active").find(".gif").val();
            $(".curr-gif2").css("display", "none");
            $(".curr-gif").css("display", "block");
            $(".curr-gif").css("background", "none");
            if (!(typeof tmpImg === "undefined")) {
              $(".curr-gif").css({
                background: "url(./Page/IMGS/" + tmpImg + ") no-repeat",
                "background-size": "cover",
              });
            } else {
              var initImg = $(".initImg").val();
              $(".curr-gif").css("background", "./Page/IMGS/" + initImg);
            }
            var tmpSound = "beep-hidden";
            if (
              !(typeof $("div.active").find(".sound")[0] === "undefined") &&
              $(thisTimer).find("input.active").val() == "1"
            ) {
              tmpSound = $("div.active").find(".sound")[0].name;
            }

            if (IsAttrSupported("audio", "autoplay")) {
              player = $(thisTimer).find("#audio-sounds")[0];

              player.src = $("#audio-sounds source#hidden" + tmpSound).attr(
                "src"
              );
              player.play();
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
          });
        $(this)
          .find("div.timer-menu div.timer-list-item")
          .bind("mousedown", function (event) {
            var allIntervals = $(thisTimer).find(
              "div.timer-menu div.timer-list-item"
            );
            var totalIntervals = allIntervals.length;
            var thisInterval = allIntervals.index(this) + 1;
            var thisDuration = $(allIntervals[thisInterval - 1])
              .find("input.duration")
              .val();
            var totalDuration = 0;

            for (var i = thisInterval - 1; i < totalIntervals; i++) {
              totalDuration += parseInt(
                $(allIntervals[i]).find("input.duration").val()
              );
            }

            $(thisTimer)
              .find(
                "div.timer-totals div.timer-remaining div.timer-total-value"
              )
              .html(ms(totalDuration));
            $(thisTimer)
              .find("div.timer-totals div.timer-remaining input.elapsed")
              .val(totalDuration);
            $(thisTimer)
              .find(
                "div.timer-totals div.timer-intervals div.timer-total-value"
              )
              .html(thisInterval + "&nbsp;/&nbsp;" + totalIntervals);
            $(thisTimer)
              .find("div.timer-countdown")
              .html(
                ms(thisDuration) +
                  '<input type="hidden" class="elapsed" value="0" />'
              );

            if (!$(this).hasClass("active") && thisInterval != totalIntervals) {
              var previousInterval = allIntervals[thisInterval - 2];
              var nextInterval = allIntervals[thisInterval];
              $(nextInterval).attr("class", "timer-list-item");
              $(allIntervals[thisInterval - 1]).attr(
                "class",
                "timer-list-item active"
              );
              $(previousInterval)
                .attr("class", "timer-list-item")
                .animate(
                  {
                    width: "0",
                  },
                  500,
                  function () {
                    $(this).hide();
                  }
                );
            } else if (thisInterval == totalIntervals) {
              $(allIntervals[thisInterval - 2]).attr(
                "class",
                "timer-list-item"
              );
              $(this).attr("class", "timer-list-item active");
            }
            if (threeBeep) {
              console.log($(allIntervals[thisInterval - 1]));
              var tmpImg = $("div.active").find(".gif").val();
              var nextGif = $("div.active").next().find(".gif").val();

              if (newDispCreated == false) {
                $(".curr-gif").after("<div class='curr-gif2'></div>");
                newDispCreated = true;

                $(".curr-gif").css("background", "none");
                if (!(typeof tmpImg === "undefined")) {
                  $(".curr-gif").css({
                    background: "url(./Page/IMGS/" + tmpImg + ") no-repeat",
                    "background-size": "cover",
                  });
                } else {
                  var initImg = $(".initImg").val();
                  $(".curr-gif").css("background", "./Page/IMGS/" + initImg);
                }
              }

              console.log(toggledDiv);
              if (toggledDiv && !(typeof tmpImg === "undefined")) {
                $(".curr-gif").css("background", "none");
                $(".curr-gif").css("display", "none");
                $(".curr-gif2").css("display", "block");
                if (!(typeof nextGif === "undefined")) {
                  $(".curr-gif").css({
                    background: "url(./Page/IMGS/" + nextGif + ") no-repeat",
                    "background-size": "cover",
                  });
                  console.log("<---IMG CACHED--->");
                  console.log("i am here 1");
                } else {
                  var initImg = $(".initImg").val();
                  $(".curr-gif").css("background", "./Page/IMGS/" + initImg);
                  console.log("i am here 2");
                }
                var prevGif =
                  document.getElementsByClassName("curr-gif2")[0].style
                    .background;
                if (prevGif.indexOf(tmpImg) == -1) {
                  if (!(typeof tmpImg === "undefined")) {
                    $(".curr-gif2").css({
                      background: "url(./Page/IMGS/" + tmpImg + ") no-repeat",
                      "background-size": "cover",
                    });
                  } else {
                    var initImg = $(".initImg").val();
                    $(".curr-gif2").css("background", "./Page/IMGS/" + initImg);
                  }
                }

                toggledDiv = false;
              } else {
                $(".curr-gif2").css("background", "none");
                $(".curr-gif2").css("display", "none");
                $(".curr-gif").css("display", "block");
                if (!(typeof nextGif === "undefined")) {
                  $(".curr-gif2").css({
                    background: "url(./Page/IMGS/" + nextGif + ") no-repeat",
                    "background-size": "cover",
                  });
                  console.log("<---IMG CACHED--->");
                  console.log("i am here 5");
                } else {
                  var initImg = $(".initImg").val();
                  $(".curr-gif2").css("background", "./Page/IMGS/" + initImg);
                  console.log("i am here 6");
                }
                var prevGif =
                  document.getElementsByClassName("curr-gif")[0].style
                    .background;
                console.log(
                  "prevGif:- " + prevGif + " " + "tmpImg:- " + tmpImg
                );
                if (prevGif.indexOf(tmpImg) == -1) {
                  if (!(typeof tmpImg === "undefined")) {
                    $(".curr-gif").css({
                      background: "url(./Page/IMGS/" + tmpImg + ") no-repeat",
                      "background-size": "cover",
                    });
                  } else {
                    var initImg = $(".initImg").val();
                    $(".curr-gif").css("background", "./Page/IMGS/" + initImg);
                  }
                }

                toggledDiv = true;
              }

              var tmpSound = "beep-hidden";
              if (
                !(typeof $("div.active").find(".sound")[0] === "undefined") &&
                $(thisTimer).find("input.active").val() == "1"
              ) {
                tmpSound = $("div.active").find(".sound")[0].name;
              }

              if (IsAttrSupported("audio", "autoplay")) {
                player = $(thisTimer).find("#audio-sounds")[0];

                tog = false;
                sx = true;
                var lorem = player.src;
                var ipsum = $("#audio-sounds source#hidden" + tmpSound).attr(
                  "src"
                );

                console.log("ps=" + lorem + " ss=" + ipsum);
                if (lorem.indexOf(ipsum) != -1) {
                  sx = false;
                  player.play();
                  console.log("played from cache");
                } else {
                  sx = true;
                  player.src = $("#audio-sounds source#hidden" + tmpSound).attr(
                    "src"
                  );
                  player.play();
                  console.log("played from new source");
                }
                player.onended = function () {
                  if (true) {
                    t = $("div.active").next().find(".sound")[0].name;
                    player.src = $("#audio-sounds source#hidden" + t).attr(
                      "src"
                    );
                    if (tog) {
                      tog = false;

                      player.play();
                      player.pause();
                      console.log("toggled sound");
                    }
                    console.log("ended");
                  }
                };
                threeBeep = false;
              }
            } else {
              var tmpImg = $("div.active").find(".gif").val();
              $(".curr-gif2").css("display", "none");
              $(".curr-gif").css("display", "block");
              $(".curr-gif").css("background", "none");
              if (!(typeof tmpImg === "undefined") && !restartClicked) {
                $(".curr-gif").css({
                  background: "url(./Page/IMGS/" + tmpImg + ") no-repeat",
                  "background-size": "cover",
                });
              } else {
                var initImg = $(".initImg").val();
                $(".curr-gif").css({
                  background: "url(./Page/IMGS/" + initImg + ") no-repeat",
                  "background-size": "cover",
                });
              }
              var tmpSound = "beep-hidden";
              if (
                !(typeof $("div.active").find(".sound")[0] === "undefined") &&
                !restartClicked
              ) {
                tmpSound = $("div.active").find(".sound")[0].name;
              }
              if (IsAttrSupported("audio", "autoplay")) {
                player = $(thisTimer).find("#audio-sounds")[0];

                player.src = $("#audio-sounds source#hidden" + tmpSound).attr(
                  "src"
                );
                player.play();
              }
              restartClicked = false;
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
          });
        $(this)
          .find("div.timer-menu div.timer-restart")
          .bind("mousedown", function (event) {
            restartClicked = true;
            $(thisTimer)
              .find("div.timer-menu div.timer-list-item")
              .each(function () {
                $(this).show().attr("class", "timer-list-item").animate(
                  {
                    width: "50%",
                  },
                  500
                );
              });

            if ($(thisTimer).find("input.active").val() == "1") {
              $(thisTimer)
                .find("div.timer-menu div.timer-next")
                .trigger("mousedown");
            }
            $(thisTimer)
              .find("div.timer-totals div.timer-elapsed input.elapsed")
              .val("0");
            $(thisTimer)
              .find("div.timer-totals div.timer-elapsed div.timer-total-value")
              .html(ms(0));
            $($(thisTimer).find("div.timer-menu div.timer-list-item")[0])
              .attr("class", "timer-list-item active")
              .trigger("mousedown");

            event.preventDefault();
            event.stopPropagation();
            return false;
          });
      });
    });
    function ms(seconds) {
      var minutes = Math.floor(seconds / 60);
      var leftover = seconds - minutes * 60;
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (leftover < 10) {
        leftover = "0" + leftover;
      }
      return minutes + ":" + leftover;
    }
  }

  $(".buttonTimeList").on("click", function (event) {
    displayCart();
    timerPLay();
  });
});

// --------------------------- // ------------------------------------------

app.controller("ctrlLogin", function ($scope, $location) {
  $scope.signUpButton = function () {
    angular
      .element(document.querySelector(".container"))
      .addClass("sign-up-mode");
  };
  $scope.signInButton = function () {
    angular
      .element(document.querySelector(".container"))
      .removeClass("sign-up-mode");
  };

  $scope.isLogin = false;
  $scope.dataInfo = [];

  if (localStorage.getItem("user-list")) {
    $scope.dataInfo = angular.fromJson(localStorage.getItem("user-list"));
  }
  $scope.resetForm = function () {
    $scope.user = {};
  };
  $scope.add_user = function () {
    $scope.dataInfo.push($scope.user);
    // console.log($scope.user);
    // $scope.user = null;
    localStorage.setItem("user-list", angular.toJson($scope.dataInfo));
    $scope.signInButton();

    console.log($scope.dataInfo);
  };

  $scope.login = function () {
    var user = $scope.check_Login($scope.email, $scope.password);
    console.log(user);
    if (user) {
      $location.path("/displayDataLocal");
    } else {
      alert("ERROR");
    }

    // console.log($scope.password);
  };
  $scope.check_Login = function (email, password) {
    for (var i = 0; i < $scope.dataInfo.length; i++) {
      if (
        $scope.dataInfo[i].email == email &&
        $scope.dataInfo[i].password == password
      ) {
        return $scope.dataInfo[i];
      }
    }
    // console.log($scope.dataInfo[i]);
    return false;
  };
  // -----------
  
 
