angular.module('pickplace.services', [])

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
      // Llama al webservice para obtener la lista de competencias
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
          showAlert(message);
        }
      });
    }else {
      this.UserSession = angular.fromJson(getLocalVariable('Usuario'));
      defer.resolve(this.UserSession);
    }


    return defer.promise;
  };

});
