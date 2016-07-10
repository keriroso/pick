angular.module('pickplace.services', [])
.constant('WebservicesURL','http://dev-pick-backend.pantheonsite.io')
.service('Login', function($q, $http) {

  this.UserSession = [];

  this.getSession = function(Cargar,user1,pass) {
    var defer = $q.defer();
    var Login = parseInt(getLocalVariable('User') );
    console.log(Login);
    // Si no hay un valor anterior, asumir que es cero
    if (isNaN(Login)){
      Login = 0;
    }
    if (Login === 0 ){
      Cargar = true;
    }else{
      Cargar=false;
    }
    if (Cargar){
      // Llama al webservice para obtener la lista de preferencias
      console.log(user1);
      console.log(pass);
      user_login(user1, pass, {
        success:function(result){
          if (result.user.name!=null) {
            setLocalVariable('SessionId', angular.toJson(result.sessid));
            setLocalVariable('SessionName', angular.toJson(result.session_name));
            setLocalVariable('SessionToken', angular.toJson(result.token));
            setLocalVariable('User', angular.toJson(result.user));
            setLocalVariable('Intro',true);
            this.UserSession = result.user;
            defer.resolve(result.user);
          }
        },
        error:function(xhr, status, message){
          console.log(xhr);
          console.log(status);
          defer.reject(message);
        }
      });
    }else {
      this.UserSession = angular.fromJson(getLocalVariable('User'));
      defer.resolve(this.UserSession);
      console.log(this.UserSession);
    }
    return defer.promise;
  };

})

.service('Preferences', function($q, $http, WebservicesURL) {

  this.eventsList = [];

  this.getById = function(eventNid){

    if (this.eventsList.length === 0){
      this.getList(false);
    }

    for(ind=0; ind < this.eventsList.length; ind++){
      console.log(this.eventsList[ind]);
      if (this.eventsList[ind].nid == eventNid){
        return this.eventsList[ind];
      }
    }

    return {};

  };

  this.getList = function(forceLoading) {
    var defer = $q.defer();

    var lastLoading = parseInt( getLocalVariable('lastLoading1') );
    // Si no hay un valor anterior, asumir que es cero
    if (isNaN(lastLoading)){
      lastLoading = 0;
    }

    // Obtiene la fecha y hora actual en milisegundos (desde 1970)
    var currentTime = new Date().getTime();

    // Calcula la fecha de expiración de la información a 3 horas desde la última vez
    var expirationTime = lastLoading + (3600 * 3 * 1000);

    // Si se tiene una fecha de carga anterior y el tiempo de la última carga
    // ya expiró, se forza la carga de información desde la web.
    if (lastLoading === 0 || currentTime > expirationTime){
      forceLoading = true;
    }

    if (forceLoading){
      // Llama al webservice para obtener la lista de preferencias

      $http.get(WebservicesURL + '/cons/ws_preferencia_usuario.json').
      then(function(response) {
        if (response.data.length > 0) {
          setLocalVariable('preferences', angular.toJson(response.data));
          setLocalVariable('lastLoading1', currentTime);
          this.eventsList = response.data;
          defer.resolve(response.data);
        }
      });
    } else {
      this.eventsList = angular.fromJson(getLocalVariable('preferences'));
      defer.resolve(this.eventsList);
    }
    return defer.promise;
  };

})

.service('Promociones', function($q, $http, WebservicesURL) {

  this.PromoList = [];


  this.getList = function(forceLoading) {
    var defer = $q.defer();

    var lastLoading = parseInt( getLocalVariable('lastLoading2') );
    // Si no hay un valor anterior, asumir que es cero
    if (isNaN(lastLoading)){
      lastLoading = 0;
    }

    // Obtiene la fecha y hora actual en milisegundos (desde 1970)
    var currentTime = new Date().getTime();

    // Calcula la fecha de expiración de la información a 3 horas desde la última vez
    var expirationTime = lastLoading + (3600 * 3 * 1000);

    // Si se tiene una fecha de carga anterior y el tiempo de la última carga
    // ya expiró, se forza la carga de información desde la web.
    if (lastLoading === 0 || currentTime > expirationTime){
      forceLoading = true;
    }

    if (forceLoading){
      // Llama al webservice para obtener la lista de preferencias

      $http.get(WebservicesURL + '/cons/ws_promo_activa.json').
      then(function(response) {
        if (response.data.length > 0) {
          setLocalVariable('promociones', angular.toJson(response.data));
          setLocalVariable('lastLoading2', currentTime);
          this.PromoList = response.data;
          defer.resolve(response.data);
        }
      });
    } else {
      this.PromoList = angular.fromJson(getLocalVariable('promociones'));
      defer.resolve(this.PromoList);
    }
    return defer.promise;
  };

});
