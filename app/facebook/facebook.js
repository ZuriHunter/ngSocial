'use strict';

angular.module('ngSocial.facebook', ['ngRoute', 'ngFacebook'])

//SET UP ROUTE FOR THE NGSOCIAL FACEBOOK HOME PAGE
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])

//ADDS FACEBOOK APP ID AND THE LIST OF PERMISSIONS FOR THE APPLICATION
.config( function ($facebookProvider){
	$facebookProvider.setAppId('330433383798478');
	$facebookProvider.setPermissions("email, public_profile, user_posts, publish_actions, user_photos");
})

//FACEBOOK SDK FOR THE FACEBOOK API
.run(function($rootScope){

	 (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

})

//FACEBOOK CONTROLLER
.controller('FacebookCtrl', ['$scope', '$facebook', function($scope, $facebook) {
  
  
  $scope.isLoggedIn = false;

  //log in function
  $scope.login = function(){
    $facebook.login().then(function(){
      $scope.isLoggedIn = true; 
      refresh();
    });
  }

  //log out function
  $scope.logout = function(){
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false; 
      refresh();
    });
  }

  //refresh feature so that it will show the updated information and user's content
  function refresh(){
    $facebook.api("/me").then(function(response){
      $scope.welcomeMsg = "Welcome " + response.name; 
      $scope.isLoggedIn = true; 
      $scope.userInfo = response; 
      $facebook.api('/me/picture').then(function(response){
        $scope.picture = response.data.url; 
        $facebook.api('/me/permissions').then(function(response){
            $scope.permissions = response.data;
            $facebook.api('/me/posts').then(function(response){
                $scope.posts = response.data;
                console.log(response.data);
            })
        }); 
      })
    },

    //error function, so if the user is not logged in this message appears
    function(err){
      $scope.welcomeMsg = "Please Log In"; 
    });

  }

  //post status to Facebook through the ngSocial
  $scope.postStatus = function(){
    var body = this.body; // => takes the content that is in the post and store it into a variable called "body"

    $facebook.api('/me/feed', 'post', {message: body}).then(function(response){
      $scope.msg = 'Thanks For Posting'; 
      refresh(); 
    });
  }

  refresh();
}]);