var app = angular.module("myApp", [
  "ngRoute",
  "ngSanitize",
  "ngMessages"
]);
app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("", { templateUrl: "Page/home.html" })
      .when("/problem", { templateUrl: "Page/problem.html" })
      .when("/meditation", { templateUrl: "Page/meditation.html" })
      .when("/", {
        templateUrl: "Page/customAerobic.html",
        controller: "ctrlAerobic",
      })
      .when("/login", {
        templateUrl: "Page/login.html",
        controller: "ctrlLogin",
      })
      .when("/displayDataLocal", {
        templateUrl: "Page/displayDataLocal.html",
        controller: "ctrlLogin",
      })
      .when("/", {
        templateUrl: "Page/customAerobic.html",
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
  $(document).ready(function () {
    $step = 1;
    $loops = Math.round(100 / $step);
    $increment = 360 / $loops;
    $half = Math.round($loops / 2);
    $barColor = "#ec366b";
    $backColor = "#feeff4";

    $(function () {
      clock.init();
    });
    clock = {
      interval: null,
      init: function () {
        $(".input-btn").click(function () {
          switch ($(this).data("action")) {
            case "start":
              clock.stop();
              clock.start($(".input-num").val());
              break;
            case "stop":
              clock.stop();
              break;
          }
        });
      },
      start: function (t) {
        var pie = 0;
        var num = 0;
        var min = t ? t : 1;
        var sec = min * 60;
        var lop = sec;
        $(".count").text(min);
        if (min > 0) {
          $(".count").addClass("min");
        } else {
          $(".count").addClass("sec");
        }
        clock.interval = setInterval(function () {
          sec = sec - 1;
          if (min > 1) {
            pie = pie + 100 / (lop / min);
          } else {
            pie = pie + 100 / lop;
          }
          if (pie >= 101) {
            pie = 1;
          }
          num = (sec / 60).toFixed(2).slice(0, -3);
          if (num == 0) {
            $(".count").removeClass("min").addClass("sec").text(sec);
          } else {
            $(".count").removeClass("sec").addClass("min").text(num);
          }
          //$('.clock').attr('class','clock pro-'+pie.toFixed(2).slice(0,-3));
          //console.log(pie+'__'+sec);
          $i = pie.toFixed(2).slice(0, -3) - 1;
          if ($i < $half) {
            $nextdeg = 90 + $increment * $i + "deg";
            $(".clock").css({
              "background-image":
                "linear-gradient(90deg," +
                $backColor +
                " 50%,transparent 50%,transparent),linear-gradient(" +
                $nextdeg +
                "," +
                $barColor +
                " 50%," +
                $backColor +
                " 50%," +
                $backColor +
                ")",
            });
          } else {
            $nextdeg = -90 + $increment * ($i - $half) + "deg";
            $(".clock").css({
              "background-image":
                "linear-gradient(" +
                $nextdeg +
                "," +
                $barColor +
                " 50%,transparent 50%,transparent),linear-gradient(270deg," +
                $barColor +
                " 50%," +
                $backColor +
                " 50%," +
                $backColor +
                ")",
            });
          }
          if (sec == 0) {
            clearInterval(clock.interval);
            $(".count").text(0);
            //$('.clock').removeAttr('class','clock pro-100');
            $(".clock").removeAttr("style");
          }
        }, 1000);
      },
      stop: function () {
        clearInterval(clock.interval);
        $(".count").text(0);
        $(".clock").removeAttr("style");
      },
    };
  });
});

app.directive("compareTo", function () {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo",
    },
    link: function (scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function (modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function () {
        ngModel.$validate();
      });
    },
  };
});

let allMusic = [
  {
    name: "Harley Bird - Home",
    artist: "Jordan Schor",
    img: "music-1",
    src: "music-1",
  },
  {
    name: "Ikson Anywhere – Ikson",
    artist: "Audio Library",
    img: "music-2",
    src: "music-2",
  },
  {
    name: "Beauz & Jvna - Crazy",
    artist: "Beauz & Jvna",
    img: "music-3",
    src: "music-3",
  },
  {
    name: "Hardwind - Want Me",
    artist: "Mike Archangelo",
    img: "music-4",
    src: "music-4",
  },
  {
    name: "Jim - Sun Goes Down",
    artist: "Jim Yosef x Roy",
    img: "music-5",
    src: "music-5",
  },
  {
    name: "Lost Sky - Vision NCS",
    artist: "NCS Release",
    img: "music-6",
    src: "music-6",
  },
  // like this paste it and remember to give comma after ending of this bracket }
  // {
  //   name: "Here is the music name",
  //   artist: "Here is the artist name",
  //   img: "image name here - remember img must be in .jpg formate and it's inside the images folder of this project folder",
  //   src: "music name here - remember img must be in .mp3 formate and it's inside the songs folder of this project folder"
  // }
];
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
isMusicPaused = true;
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `./Page/IMGS/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `./Page/audio/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music function
function prevMusic() {
  musicIndex--; //decrement of musicIndex by 1
  //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

//next music function
function nextMusic() {
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
// play or pause button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//prev music button event
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//next music button event
nextBtn.addEventListener("click", () => {
  nextMusic();
});
// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting playing song currentTime
  const duration = e.target.duration; //getting playing song total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //calling playMusic function
  playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", () => {
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1); //genereting random index/numb with max range of array length
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="./Page/audio/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

//play particular song from the list onclick of li tag
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the musicIndex then add playing class in it
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
// ======================================================

//Switch light/dark
$(document).ready(function () {
  var t = document.getElementById("cursor"),
    e = document.getElementById("cursor2"),
    i = document.getElementById("cursor3");
  function n(t) {
    e.classList.add("hover"), i.classList.add("hover");
  }
  function s(t) {
    e.classList.remove("hover"), i.classList.remove("hover");
  }
  s();
  for (
    var r = document.querySelectorAll(".hover-target"), a = r.length - 1;
    a >= 0;
    a--
  ) {
    o(r[a]);
  }
  function o(t) {
    t.addEventListener("mouseover", n), t.addEventListener("mouseout", s);
  }

  //Navigation

  var app = (function () {
    var body = undefined;
    var menu = undefined;
    var menuItems = undefined;
    var init = function init() {
      body = document.querySelector("body");
      menu = document.querySelector(".menu-icon");
      menuItems = document.querySelectorAll(".nav__list-item");
      applyListeners();
    };
    var applyListeners = function applyListeners() {
      menu.addEventListener("click", function () {
        return toggleClass(body, "nav-active");
      });
    };
    var toggleClass = function toggleClass(element, stringClass) {
      if (element.classList.contains(stringClass))
        element.classList.remove(stringClass);
      else element.classList.add(stringClass);
    };
    init();
  })();
});
app.controller("customCtrl", function ($scope, $rootScope) {
  $(document).ready(function () {
    function printCart(listCard) {
      // alert(array);
      // $rootScope.listCardPractice = [];
      var outputPractice = ` `;
      $.each(listCard, function (k, v) {
        outputPractice += `<div class="card" id="${k + 1}">
                <div class="cardPractice">
                  <div class="wrapperPractice">
                    <div class="containerPractice">
                      <div class="topImgPracitceCard">
                        <img ng-src="${v.thumb}" alt="" />
                      </div>
                      <div class="bottomImgPracitceCard">
                        <div class="leftImgPracitceCard" >
                          <div class="detailsPracitceCard">
                            <h1 class="text">${v.name}</h1>
                            <p class="text">Benefit:${v.benefit}</p>
                          </div>
                          <div data-add="${k}" class="choosePractice"  >
                            <i class="material-icons"    >add</i>
                          </div>
                        </div>
                        <div class="rightImgPracitceCard">
                          <div class="donePractice">
                            <i class="material-icons">done</i>
                          </div>
                          <div class="detailsPracitceCard">
                            <h1 class="text">${v.name}</h1>
                            <p class="text">Added to your practice</p>
                          </div>
                          <div class="removePractice">
                            <i class="material-icons">clear</i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="insidePractice">
                      <div class="iconPractice">
                        <i class="material-icons">info_outline</i>
                      </div>
                      <div class="contentsPractice">${v.text}</div>
                    </div>
                  </div>
                </div>
              </div>`;
      });

      $(".card-carousel").html(outputPractice);
    }

    // ========================================
    function displayCard() {
      const cardsContainer = document.querySelector(".card-carousel");
      const cardsController = document.querySelector(
        ".card-carousel + .card-controller"
      );

      class DraggingEvent {
        constructor(target = undefined) {
          this.target = target;
        }

        event(callback) {
          let handler;

          this.target.addEventListener("mousedown", (e) => {
            e.preventDefault();

            handler = callback(e);

            window.addEventListener("mousemove", handler);

            document.addEventListener("mouseleave", clearDraggingEvent);

            window.addEventListener("mouseup", clearDraggingEvent);

            function clearDraggingEvent() {
              window.removeEventListener("mousemove", handler);
              window.removeEventListener("mouseup", clearDraggingEvent);

              document.removeEventListener("mouseleave", clearDraggingEvent);

              handler(null);
            }
          });

          this.target.addEventListener("touchstart", (e) => {
            handler = callback(e);

            window.addEventListener("touchmove", handler);

            window.addEventListener("touchend", clearDraggingEvent);

            document.body.addEventListener("mouseleave", clearDraggingEvent);

            function clearDraggingEvent() {
              window.removeEventListener("touchmove", handler);
              window.removeEventListener("touchend", clearDraggingEvent);

              handler(null);
            }
          });
        }

        // Get the distance that the user has dragged
        getDistance(callback) {
          function distanceInit(e1) {
            let startingX, startingY;

            if ("touches" in e1) {
              startingX = e1.touches[0].clientX;
              startingY = e1.touches[0].clientY;
            } else {
              startingX = e1.clientX;
              startingY = e1.clientY;
            }

            return function (e2) {
              if (e2 === null) {
                return callback(null);
              } else {
                if ("touches" in e2) {
                  return callback({
                    x: e2.touches[0].clientX - startingX,
                    y: e2.touches[0].clientY - startingY,
                  });
                } else {
                  return callback({
                    x: e2.clientX - startingX,
                    y: e2.clientY - startingY,
                  });
                }
              }
            };
          }

          this.event(distanceInit);
        }
      }

      class CardCarousel extends DraggingEvent {
        constructor(container, controller = undefined) {
          super(container);
          var listPracticeCard = $rootScope.products;
          // DOM elements
          this.container = container;
          this.controllerElement = controller;
          this.cards = container.querySelectorAll(".card");

          // Carousel data
          this.centerIndex = (this.cards.length - 1) / 2; //2
          this.cardWidth =
            (this.cards[0].offsetWidth / this.container.offsetWidth) * 100; //100
          this.xScale = {};

          // Resizing
          window.addEventListener("resize", this.updateCardWidth.bind(this));

          if (this.controllerElement) {
            this.controllerElement.addEventListener(
              "keydown",
              this.controller.bind(this)
            );
          }

          // Initializers
          this.build();

          // Bind dragging event
          super.getDistance(this.moveCards.bind(this));
        }

        updateCardWidth() {
          this.cardWidth =
            (this.cards[0].offsetWidth / this.container.offsetWidth) * 100; //100

          this.build();
        }

        build(fix = 0) {
          for (let i = 0; i < this.cards.length; i++) {
            const x = i - this.centerIndex;
            const scale = this.calcScale(x);
            const scale2 = this.calcScale2(x);
            const zIndex = -Math.abs(i - this.centerIndex);

            const leftPos = this.calcPos(x, scale2);

            this.xScale[x] = this.cards[i];

            this.updateCards(this.cards[i], {
              x: x,
              scale: scale,
              leftPos: leftPos,
              zIndex: zIndex,
            });
          }
        }

        controller(e) {
          const temp = { ...this.xScale };

          if (e.keyCode === 39) {
            // 39
            // Left arrow
            for (let x in this.xScale) {
              const newX =
                parseInt(x) - 1 < -this.centerIndex
                  ? this.centerIndex
                  : parseInt(x) - 1;

              temp[newX] = this.xScale[x];
            }
          }

          if (e.keyCode == 37) {
            //37
            // Right arrow
            for (let x in this.xScale) {
              const newX =
                parseInt(x) + 1 > this.centerIndex
                  ? -this.centerIndex
                  : parseInt(x) + 1;

              temp[newX] = this.xScale[x];
            }
          }

          this.xScale = temp;

          for (let x in temp) {
            const scale = this.calcScale(x),
              scale2 = this.calcScale2(x),
              leftPos = this.calcPos(x, scale2),
              zIndex = -Math.abs(x);

            this.updateCards(this.xScale[x], {
              x: x,
              scale: scale,
              leftPos: leftPos,
              zIndex: zIndex,
            });
          }
        }

        calcPos(x, scale) {
          let formula;

          if (x < 0) {
            formula = (scale * 100 - this.cardWidth) / 2;

            return formula;
          } else if (x > 0) {
            formula = 100 - (scale * 100 + this.cardWidth) / 2;

            return formula;
          } else {
            formula = 100 - (scale * 100 + this.cardWidth) / 2;

            return formula;
          }
        }

        updateCards(card, data) {
          if (data.x || data.x == 0) {
            card.setAttribute("data-x", data.x);
          }

          if (data.scale || data.scale == 0) {
            card.style.transform = `scale(${data.scale})`;

            if (data.scale == 0) {
              card.style.opacity = data.scale;
            } else {
              card.style.opacity = 1;
            }
          }

          if (data.leftPos) {
            card.style.left = `${data.leftPos}%`;
          }

          if (data.zIndex || data.zIndex == 0) {
            if (data.zIndex == 0) {
              card.classList.add("highlight");
            } else {
              card.classList.remove("highlight");
            }

            card.style.zIndex = data.zIndex;
          }
        }

        calcScale2(x) {
          let formula;

          if (x <= 0) {
            formula = 1 - (-1 / 5) * x; //5

            return formula;
          } else if (x > 0) {
            formula = 1 - (1 / 5) * x;

            return formula;
          }
        }

        calcScale(x) {
          const formula = 1 - (1 / 5) * Math.pow(x, 2);

          if (formula <= 0) {
            return 0;
          } else {
            return formula;
          }
        }

        checkOrdering(card, x, xDist) {
          const original = parseInt(card.dataset.x);
          const rounded = Math.round(xDist);
          let newX = x;

          if (x !== x + rounded) {
            if (x + rounded > original) {
              if (x + rounded > this.centerIndex) {
                newX =
                  x +
                  rounded -
                  1 -
                  this.centerIndex -
                  rounded +
                  -this.centerIndex;
              }
            } else if (x + rounded < original) {
              if (x + rounded < -this.centerIndex) {
                newX =
                  x +
                  rounded +
                  1 +
                  this.centerIndex -
                  rounded +
                  this.centerIndex;
              }
            }

            this.xScale[newX + rounded] = card;
          }

          const temp = -Math.abs(newX + rounded);

          this.updateCards(card, { zIndex: temp });

          return newX;
        }

        moveCards(data) {
          let xDist;

          if (data != null) {
            this.container.classList.remove("smooth-return");
            xDist = data.x / 300; //250
          } else {
            this.container.classList.add("smooth-return");
            xDist = 0;

            for (let x in this.xScale) {
              this.updateCards(this.xScale[x], {
                x: x,
                zIndex: Math.abs(Math.abs(x) - this.centerIndex),
              });
            }
          }

          for (let i = 0; i < this.cards.length; i++) {
            const x = this.checkOrdering(
                this.cards[i],
                parseInt(this.cards[i].dataset.x),
                xDist
              ),
              scale = this.calcScale(x + xDist),
              scale2 = this.calcScale2(x + xDist),
              leftPos = this.calcPos(x + xDist, scale2);

            this.updateCards(this.cards[i], {
              scale: scale,
              leftPos: leftPos,
            });
          }
        }
      }

      const carousel = new CardCarousel(cardsContainer);
    }

    // ===============================

    printCart($rootScope.products);
    displayCard();
    $(".filterAll").click(function () {
      printCart($rootScope.products);
      displayCard();
      $(".choosePractice").on("click", function () {
        var add = $(this).attr("data-add");
        $scope.addItem(add);
      });
    });
    $(document).ready(function () {
      $(".choosePractice").on("click", function () {
        var add = $(this).attr("data-add");
        $scope.addItem(add);
      });
    });

    // angular
    //   .element(document.getElementsByClassName("choosePractice"))
    //   .on("click", () => {
    //     var add = this.getAttribute("data-add");
    //     $scope.addItem(add);
    //   });

    $scope.category = Object.keys(
      $rootScope.products.reduce(function (categoryMap, product) {
        categoryMap[product.category] = 0;

        return categoryMap;
      }, {})
    );
    $scope.setFilterCategory = function (value) {
      showfilter(value);
    };

    function showfilter(value) {
      var data_filter = $rootScope.products.filter(
        (element) => element.category == value
      );

      printCart(data_filter);
      displayCard();
      $(".choosePractice").on("click", function () {
        var add = $(this).attr("data-add");
        $scope.addItem(add);
      });
      // console.log(data_filter);
    }
    $(".search-icon").click(function (e) {
      e.preventDefault();

      let search = $(".inputSearch").val();
      let re = new RegExp(search, "ig");
      let subdata = $rootScope.products.filter(
        (item) => item.name.search(re) >= 0
      );

      printCart(subdata);
      displayCard();
      $(".choosePractice").on("click", function () {
        var add = $(this).attr("data-add");
        $scope.addItem(add);
      });
    });
    $(".cancel-icon").click(function (e) {
      printCart($rootScope.products);
      displayCard();
      document.getElementsByClassName("inputSearch").value = " ";
      $(".choosePractice").on("click", function () {
        var add = $(this).attr("data-add");
        $scope.addItem(add);
      });
    });
    printCart($rootScope.products);
    displayCard();
    totalPractice = 0;
    $rootScope.totalChoose = 0;
    $scope.total = function (flag, flagCount) {
      if (flag == true) {
        totalPractice++;
      } else if (flagCount === 1) {
        totalPractice--;
      }
      // alert(totalPractice);

      $(".showTotalChoose").text(totalPractice);
      if (totalPractice > 0) {
        $(".labelTotal").css("display", "block");
        $(".listCardPractice").css("left", "-400px");
      } else {
        $(".listCardPractice").css("left", "-420px");
        $(".labelTotal").css("display", "none");
        $("#tab-1").prop("checked", true);
      }
    };

    // ============================================

    $(function () {
      $(".sortable-card").sortable({});
      $(".sortable-card").disableSelection();
    });

    function dragCardChoose(listPracticeChoose) {
      // alert(array);
      // $rootScope.listCardPractice = [];

      var arrayCardChoose = ` `;
      $.each(listPracticeChoose, function (k, v) {
        arrayCardChoose += `<li class="ui-state-default"><div class="outSide">
                <div class="move">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="img">
                  <img src="${v.thumb}" alt="" />
                </div>
                <div class="nameAndAmount">
                  <div class="nameTop">${v.name}</div>
                  <div class="amountBottom">
                   

                    <div class="input">
                      <span>time:</span>
                      <input type="number" ng-model="listPractice[${k}].reps" class="getValueInput" value="${v.reps}"/>second
                    </div>
                  </div>
                </div>
                <div class="delete">
                  <img class="delPracticeChoose"  data-index="${k}" src="../IMG/close.png" alt="" />
                </div>
              </div></li>`;
      });

      $(".sortable-card").html(arrayCardChoose);
    }
    // ====================================

    // ===========================================
    $scope.addItem = function (index) {
      var add = index;
      var flagCount = 0;
      if ($rootScope.listPractice.length == 0) {
        $rootScope.listPractice.push($rootScope.products[add]);
        flag = true;
      } else {
        for (var i = 0; i < $rootScope.listPractice.length; i++) {
          flag = true;
          for (var n = 0; n < $rootScope.listPractice.length; n++) {
            if ($rootScope.listPractice[n].id == $rootScope.products[add].id) {
              flag = false; // trung

              break;
            }
          }
          if (flag == true) {
            $rootScope.listPractice.push($rootScope.products[add]);

            break; // khac
          }
        }
      }
      dragCardChoose($rootScope.listPractice);
      $scope.total(flag, flagCount);
      // console.log(add);
      // $(".bottomImgPracitceCard").addClass("clicked");
      console.log($rootScope.listPractice);
    };
    // ============================================
    $(".buttonTimeList").on("click", function () {
      $("#tab-3").prop("checked", true);
      $(".backGroundPracticeRight").css("display", "block");
      $(".dragGrid").css("display", "none");
      $(".showChoosePractice").css("display", "none");
    });
    $(".labelTotal").on("click", function () {
      $(".backGroundPracticeRight").css("display", "none");
      $("#tab-2").prop("checked", true);
      $(".showChoosePractice").css("display", "block");
      $(".dragGrid").css("display", "block");
    });
    $(".listCardPractice").on("click", function () {
      $(".backGroundPracticeRight").css("display", "none");
      $("#tab-1").prop("checked", true);
      $(".dragGrid").css("display", "block");
      $(".showChoosePractice").css("display", "block");
    });

    // ============================================

    $(".sortable-card").on("click", "li .delPracticeChoose", function () {
      var item = this.getAttribute("data-index");
      var flagCount = 1;
      var flag = false;

      $rootScope.listPractice.splice(item, 1);
      console.log($rootScope.listPractice);
      dragCardChoose($rootScope.listPractice);
      $scope.total(flag, flagCount);
    });
    $scope.pushArray = function () {
      var arrayTest = [];
      $.each($rootScope.listPractice, function (index, value) {
        arrayTest.push({ name: value.name });
      });
      var arrayReps = [];
      let inputs = document.getElementsByClassName("getValueInput");
      for (i of inputs) {
        arrayReps.push({ reps: parseInt(i.value) });
      }
      let newArray = [];
      for (var i = 0; i < arrayTest.length; i++) {
        newArray.push({ name: arrayTest[i].name, reps: arrayReps[i].reps });
      }

      $scope.timePractice = [];
      $scope.timePractice.push(newArray);

      localStorage.setItem("arrayList", angular.toJson(newArray));
      console.log(newArray);
    };
    $(".buttonTimeList").on("click", function () {
      $scope.pushArray();
    });

    // $(".listCardPractice").on("click", function () {
    //   $(".showChoosePractice").css("display", "none");
    // });
  });

  // =========================================
  // ================================
});
app.controller("printItem", function ($scope, $rootScope) {
  $scope.onSearch = function (search) {
    angular.element(document.querySelector(".search-box")).addClass("active");
    angular.element(document.querySelector(".search-icon")).addClass("active");
    angular.element(document.querySelector(".inputSearch")).addClass("active");
    angular.element(document.querySelector(".cancel-icon")).addClass("active");
    return search;
  };
  $scope.offSearch = function () {
    angular
      .element(document.querySelector(".search-box"))
      .removeClass("active");
    angular
      .element(document.querySelector(".search-icon"))
      .removeClass("active");
    angular
      .element(document.querySelector(".inputSearch"))
      .removeClass("active");
    angular
      .element(document.querySelector(".cancel-icon"))
      .removeClass("active");
  };
});
