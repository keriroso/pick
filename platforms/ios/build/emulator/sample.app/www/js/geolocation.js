angular
    .module('pickplace.geolocation', ['ngGeolocation'])
    .controller('geolocCtrl', ['$geolocation', '$scope', function($geolocation, $scope) {
      $scope.mostrar_url_ubicacion = false;
      $scope.mostrar_boton_gps = false;
         $geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
            console.log('Tu posicion : ', $scope.myPosition );
            $scope.mostrar_boton_gps = true;
         });
         
        
        
        $scope.obtenerActualPosicion = function() {
          
          $geolocation.watchPosition({
            timeout: 60000,
            maximumAge: 250,
            enableHighAccuracy: true
          });
          
          $scope.myCoords = $geolocation.position.coords; // Se actualiza regularmente
          $scope.myError = $geolocation.position.error; // Error
          
          console.log('$scope.myCoords : ' , $scope.myCoords);
          console.log('$scope.myError : ' , $scope.myError);
          
          // Armar la URL de Google maps
          $scope.url_google_maps = 'https://www.google.com.ec/maps/@';
          $scope.url_google_maps += $scope.myCoords.latitude + ',';
          $scope.url_google_maps += $scope.myCoords.longitude + ',';
          $scope.url_google_maps += $scope.myCoords.accuracy + '28z';
          
          console.log('url_google_maps : ' + $scope.url_google_maps);
          $scope.mostrar_url_ubicacion = true;
        };
        
      
    }]);