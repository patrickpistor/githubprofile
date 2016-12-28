(function(){
  
  var github = function($http) {
    var getProfile = function(user) {
      return $http.get("https://api.github.com/users/" + user)
                .then(function(response) {
                  return response.data;
                });
    };

    var getRepos = function(url) {
      return $http.get(url)
                .then(function(response) {
                  return response.data;
                });
    };

    return {
      getProfile: getProfile,
      getRepos: getRepos
    };
  };
  
  var module = angular.module("portfolio");
  module.factory("github", github);
  
}());