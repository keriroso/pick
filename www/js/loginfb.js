
angular.module('pickplace.loginfb', ['pickplace.services','angular.filter'])

/*
 *  Controlador para login con Facebook
 */
.controller('FacebookCtrl', ['$scope', '$facebook', function($scope, $facebook) {
  
    $scope.$on('fb.auth.authResponseChange', function() {
      console.log('$on');
      $scope.status = $facebook.isConnected();
      if($scope.status) {
        $facebook.api('/me').then(function(user) {
          $scope.user = user;
          console.log('User facebook:');
          console.log($scope.user);
        });
        
        // Correo, deportes
        $facebook.api('/me', {fields : 'email, sports'}).then(function(user) {
          $scope.user = user;
          console.log('EMAIL - User facebook:');
          console.log($scope.user);
        });
        
        // imagen de perfil - tamaño: large
        $facebook.api(
          "/me/picture",
          {type: 'large'}
        ).then(function(picture) {
          $scope.picture = picture;
          console.log('PICTURE - User facebook:');
          console.log($scope.picture);
        });
                
      }
    });

    $scope.loginToggle = function() {
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