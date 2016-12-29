(function() {
  
    var app = angular.module("portfolio", ['ngRoute', 'smoothScroll']);
    //Filter to Unique results
    app.filter('unique', function () {
        return function (items, filterOn) {
            if (filterOn === false) {
                return items;
            }
            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];
                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };
                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;
                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }
                });
                items = newItems;
            }
            return items;
        };
    });
    
    app.directive("scroll", function ($window, $rootScope) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                 if (this.pageYOffset >= 1) {
                     $rootScope.navbar = "background-color: #fff; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 1px 5px 0 rgba(0,0,0,0.12),0 3px 1px -2px rgba(0,0,0,0.2);";
                     $rootScope.color = "color: #2c3e50;";
                 } else {
                     $rootScope.navbar = "background-color: #2c3e50; box-shadow: 0 0px 0px 0 rgba(0,0,0,0),0 0px 0px 0 rgba(0,0,0,0),0 0px 0px 0px rgba(0,0,0,0); padding-top: 10px;";
                     $rootScope.color = "color: #ecf0f1;";
                 }
                scope.$apply();
            });
        };
    });
    
    app.config(function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'main.html'
        })
        .when('/404', {
            templateUrl: '404.html'
        })
        .when('/:username', {
            templateUrl: 'users.html'
        })
        .otherwise({
            templateUrl: '404.html'
        });
    });

    var UserController = function($scope, $rootScope, github, $routeParams, $location) {
        var onUserComplete = function(data) {
            $scope.user = data;
            $scope.first = "";
            $scope.title = data.name;
            
            if (data.location != null) {
                if(data.company != null) {
                    $scope.first = "I currently live in "+ data.location +", where I work for "+ data.company +".";
                }
                else {
                    $scope.first = "I currently live in "+ data.location +".";
                }
            } else if(data.company != null) {
                $scope.first = "I currently work for "+ data.company +".";
            }
            
            if(data.hireable == true) {
                $scope.message = "I am available for hire, so if you have any work for me, feel free to reach me at my email with any inquiries";
            } else {
                $scope.message = "At this time I am not actively seeking employment, but feel free to contact me at my email with any inquiries";
            }
            github.getRepos($scope.user.repos_url).then(onRepos, onError);
            github.getRepos($scope.user.organizations_url).then(onOrgs, onError);
        }

        var onRepos = function(data){
            $scope.repos = data;
        };
        
        var onOrgs = function(data){
            $scope.orgs = data;
        };

        var onError = function(reason) {
            $scope.error = "Could not fetch the data.";
        };
        
        var onUserError = function(reason) {
            $location.path("/404");
            $scope.error = "Could not fetch the data.";
            console.log("hit");
        };
        
        
        
        $rootScope.navbar = "background-color: #2c3e50; box-shadow: 0 0px 0px 0 rgba(0,0,0,0),0 0px 0px 0 rgba(0,0,0,0),0 0px 0px 0px rgba(0,0,0,0); padding-top: 10px;";
        $rootScope.color = "color: #ecf0f1;";
        $scope.username = $routeParams.username;
        github.getProfile($scope.username).then(onUserComplete, onUserError);
        $scope.date = new Date();
    };

    app.controller("UserController", ["$scope", "$rootScope", "github", "$routeParams", "$location", UserController]);
    app.controller("MainController", ["$scope", "$location", function($scope, $location) {       
        $scope.title = "Github Profile"
        $scope.go = function(username) {
            $location.path("/" + username);
        }
    }]);


}());