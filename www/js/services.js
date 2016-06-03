angular.module('pickplace.services', [])
.constant('WebservicesURL','http://dev-pick-backend.pantheonsite.io')
.service('IniciarSesion', function($q, $http) {

  this.UserSession = [];

  this.getSession = function(Cargar,user1,pass) {
    var defer = $q.defer();
    var InicioSession = parseInt(getLocalVariable('Usuario') );
    console.log(InicioSession);
    // Si no hay un valor anterior, asumir que es cero
    if (isNaN(InicioSession)){
      InicioSession = 0;
    }
    if (InicioSession === 0 ){
      Cargar = true;
    }else{
      Cargar=false;
    }
    if (Cargar){
      // Llama al webservice para obtener la lista de preferencias
      user_login(user1, pass, {
        success:function(result){
          if (result.user.name!=null) {
            setLocalVariable('SessionId', angular.toJson(result.sessid));
            setLocalVariable('SessionName', angular.toJson(result.session_name));
            setLocalVariable('SessionToken', angular.toJson(result.token));
            setLocalVariable('Usuario', angular.toJson(result.user));
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
      this.UserSession = angular.fromJson(getLocalVariable('Usuario'));
      defer.resolve(this.UserSession);
    }


    return defer.promise;
  };

})

.service('Preferencias', function($q, $http, WebservicesURL) {

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

    var lastLoading = parseInt( getLocalVariable('lastLoading') );
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

      $http.get(WebservicesURL + '/rest/ws_preferencias.json').
      then(function(response) {
        if (response.data.length > 0) {
          setLocalVariable('preferencias', angular.toJson(response.data));
          setLocalVariable('lastLoading', currentTime);
          this.eventsList = response.data;
          defer.resolve(response.data);
        }
      });
    } else {
      this.eventsList = angular.fromJson(getLocalVariable('preferencias'));

      defer.resolve(this.eventsList);
    }


    return defer.promise;
  };

});
