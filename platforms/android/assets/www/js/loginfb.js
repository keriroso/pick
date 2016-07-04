
angular.module('pickplace.loginfb', ['pickplace.services','angular.filter'])

/*
*  Controlador para login con Facebook
*/
.controller('FacebookCtrl', ['$scope', '$rootScope','$facebook', function($scope,$rootScope, $facebook,Login) {

  $scope.$on('fb.auth.authResponseChange', function() {
    $scope.status = $facebook.isConnected();
    console.log($facebook);
    if($scope.status) {
      console.log($facebook.getAuthResponse().accessToken);
      $scope.userFacebook=[];
      // imagen de perfil - tamanio: large
      $facebook.api(
        "/me/picture",
        {type: 'large'}
      ).then(function(picture) {
        $scope.picture = picture;
        console.log('PICTURE - User facebook:');
        console.log($scope.picture);
        $scope.SaveKeys($scope.picture);
      });
      //Datos del usuario
      $facebook.api('/me', {fields : 'email,name'}).then(function(user) {
        $scope.user = user;
        //public_profile,user_friends,user_birthday,user_likes
        console.log('User - User facebook:');
        console.log($scope.user);
        $scope.SaveKeys($scope.user);
      });
      $scope.SaveKeys=function(value){
        $scope.userFacebook.push(value);
        console.log($scope.userFacebook);
        if($scope.userFacebook.length > 1){
          $rootScope.$broadcast('UserFacebook',{ user: $scope.userFacebook });
        }
      }
      //guardar en drupal
      // $rootScope.createAccount($scope.user.name,$scope.user.email,$scope.user.id);


    }
  });

  $scope.loginFacebook = function() {
    console.log('$scope.status: ' + $scope.status);
    if($scope.status) {
      $facebook.logout();
    } else {
      $facebook.login();
    }
  };

  $scope.getFriends = function() {
    if(!$scope.status) return;
    $facebook.cachedApi('/me/friends').then(function(friends) {
      $scope.friends = friends.data;
    });
  }
}])

;
