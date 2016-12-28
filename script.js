(function() {
  
    var app = angular.module("portfolio", ['ngRoute']);
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
    
    app.config(function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'main.html',
        })
        .when('/:username', {
            templateUrl: 'users.html',
        })
        .otherwise({
            template : "Bad Username"
        });
    });

    var UserController = function($scope, github, $routeParams) {
        var onUserComplete = function(data) {
            $scope.user = data;
            $scope.first = "";
            
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
                $scope.message = "I am currently available for hire, so if you have any work for me, feel free to reach me at " + data.email;
            } else {
                $scope.message = "At this time I am not actively seeking employment, but feel free to contact me at " + data.email + " with any enquiries"
            }
            github.getRepos($scope.user.repos_url).then(onRepos, onError);
        }

        var onRepos = function(data){
            $scope.repos = data;
        };

        var onError = function(reason) {
            $scope.error = "Could not fetch the data.";
        };
        
        $scope.username = $routeParams.username;
        github.getProfile($scope.username).then(onUserComplete, onError);
        $scope.date = new Date();
    };

    app.controller("UserController", ["$scope", "github", "$routeParams", UserController]);
    app.controller("MainController", ["$scope", "$location", function($scope, $location) {        
        $scope.go = function(username) {
            $location.path("/" + username);
        }
    }]);


}());