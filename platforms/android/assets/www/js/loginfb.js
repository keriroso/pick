
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
          //   $rootScope.$broadcast('UserFacebook',{ user: $scope.userFacebook });
          // }
          // $scope.$on('UserFacebook', function(event,args) {
          $scope.userData = $scope.userFacebook;
          console.log($scope.userData);
          var userName='';
          var userEmail='';
          var userId='';// el id se lo toma como password
          var facebook=true;
          angular.forEach($scope.userData,function(key,value){
            if(!angular.isUndefined(key.name) || !angular.isUndefined(key.mail) || !angular.isUndefined(key.id)){
              userName=key.name;
              userEmail=key.email;
              userId= key.id;// el id se lo toma como password
            }else {
              var userPicture=key.data.url;
            }
          });
          console.log(userName);
          var userSocial={
            name:userName,
            email:userEmail,
          };
          $scope.isLoading = true;
          var account = {
            type:'facebook',
            data:userSocial
          };

          $scope.loginFacebookDrupal(account);
        };
        $scope.loginFacebookDrupal =function(account){
          $scope.isLoading=true;
          user_create_social(account,{
            success:function(result) {
              $scope.isLoading=false;
              $scope.login(result.data.user,result.data.class);

            },
            error:function(xhr, status, message){
              console.log(xhr);
              console.log(status);
              $scope.isLoading = false;
              $scope.msgError=angular.fromJson(message);


            }
          });
        };

      }
      
    }
  });
  $scope.loginFacebook = function() {
    $scope.isLoading=true;
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
