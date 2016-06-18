angular
    .module('pickplace.geolocation', ['ngGeolocation'])
    .controller('geolocCtrl', ['$geolocation', '$scope', function($geolocation, $scope) {
         $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
            console.log('Tu posición : ' + $scope.myPosition );
         });
         
        
        
        $scope.obtenerActualPosicion = function() {
          $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
          });
          $scope.myCoords = $geolocation.position.coords; // this is regularly updated
          $scope.myError = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
          
          console.log('$scope.myCoords : ' , $scope.myCoords);
          console.log('$scope.myError : ' , $scope.myError);
          var url_google_maps = 'https://www.google.com.ec/maps/@';
          url_google_maps += $scope.myCoords.latitude + ',';
          url_google_maps += $scope.myCoords.longitude + ',';
          url_google_maps += $scope.myCoords.accuracy + '19z';
          
          console.log('url_google_maps : ' + url_google_maps);
        };
        
      
    }]);