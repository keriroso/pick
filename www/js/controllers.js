/* global angular, document, window */
'use strict';
angular.module('pickplace.controllers', ['pickplace.services'])
/*
INTRO
Controlador para el intro de pick

*/
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate,$window) {
  // Funcion de redirección  al inicio de sesion
  $scope.startApp = function() {
    $window.location.href='#/inicio';
  };
  //Funcion para avanzar al sigguiente slider
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  //Funcion para regresar de slider
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  //  Funcion que llama cuando un slider cambia para indicar que es el indice
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  var intro = (getLocalVariable('Intro') );
  if (intro) {
    $window.location.href='#/inicio';
  }

})
/*
LOGIN
Funcion de inicio de sesion
*/
.controller('UsuarioCtrl', function($scope,$sce,$timeout,$state, $stateParams, ionicMaterialInk,$rootScope,IniciarSesion,$window,$ionicModal,$ionicPopup) {
  //funcion para inicio de session
  $scope.login = function(user1,pass) {
    $scope.isLoading = true;
    if(user1!=null && pass!=null){
      IniciarSesion.getSession(true,user1,pass).then(function(data){
        console.log(data);
        $scope.isLoading = false;
        $rootScope.usuario=data;
        console.log(window.localStorage.getItem('Preferencia'));
        if(window.localStorage.getItem('Preferencia')==''){
        $state.go('preferencia');
        }else{
        $state.go('tab.main');
        }
        console.log($scope.usuario);
      }).catch(function(data) {
        $scope.showAlertas('Error',data);
        $scope.isLoading = false;
      });
    }else{
      $scope.showAlertas('Error','Ingrese los campos vacíos');
      $scope.isLoading = false;
    }
  };
  $scope.EliminarSession = function(cargar) {
    $scope.isLoading = true;
    if(cargar){
      user_logout({
        success:function(result){
          if (result[0]) {
            alert("Logged out!");
          }
        }
      });
      localStorage.removeItem("Usuario");
      localStorage.removeItem("SessionId");
      localStorage.removeItem("SessionName");
      localStorage.removeItem("SessionToken");
      setLocalVariable("Usuario",null);
      $scope.isLoading = false;
      $window.location.href='#/inicio';
    }
    $scope.isLoading = false;
  };
  $scope.createAccount = function(nombre,correo,clave){
    $scope.isLoading = true;
    var account = {
      name:nombre,
      mail:correo,
      pass:clave,
      field_prueba:'prueba'
    };
    user_save(account,{
      success:function(result) {
        $scope.login(nombre,clave);
      },
      error:function(xhr, status, message){
        console.log(xhr);
        console.log(status);
        $scope.isLoading = false;
        $scope.msgError=angular.fromJson(message);

        var name='';
        var mail='';
        var pass='';
        if(!angular.isUndefined($scope.msgError.form_errors.name)){
          name='<ion-item class="space-none">'+$scope.msgError.form_errors.name+'</ion-item>';
        }
        if(!angular.isUndefined($scope.msgError.form_errors.mail)){
          mail='<ion-item class="space-none">'+$scope.msgError.form_errors.mail+'</ion-item>';
        }
        if(!angular.isUndefined($scope.msgError.form_errors.pass)){
          pass='<ion-item class="space-none">'+$scope.msgError.form_errors.pass+'</ion-item>';
        }
              $scope.msg='<ion-list>'+name+mail+pass+'</ion-list>';
        console.log($scope.msgError.form_errors.name);
        console.log($scope.msgError.form_errors.mail);
        console.log($scope.msgError.form_errors.pass);


        $scope.showAlertas('Formulario',$scope.msg);
      }
    });
  };
  $scope.requestPassword=function(valor){
    $scope.isLoading = true;
    if(valor!=null){
      user_request_new_password(valor, {
        success: function(result) {
          if (result[0]) {
            $scope.isLoading = false;
            $scope.showAlertas('Recuperar Contraseña','Instrucciones adicionales han sido enviados a su dirección de e-mail.');
            $scope.closeModal();
          }
        }

      });
    }else {
      $scope.showAlertas('Error','Ingrese un email valído');
      $scope.isLoading = false;
    }
  };
  $scope.RegisterApp = function() {
    $state.go('registro');
  };
  $scope.LoginApp = function() {
    $state.go('login');
  };
  // recuperar password
  $ionicModal.fromTemplateUrl('password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.showAlertas = function(titulo,mensaje) {
    var alertPopup = $ionicPopup.alert({
      title: titulo,
      template:  $sce.trustAsHtml(mensaje),
      buttons: [
        { text: 'OK',
        type:'button-assertive',
        }
    ]
  });
  alertPopup.then(function(res) {
    // console.log('res');
  });
};
})

.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

  // Triggered on a button click, or some other target
  $scope.showPopup = function() {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="data.wifi">',
      title: 'Enter Wi-Fi Password',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.wifi;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  };

  // A confirm dialog
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Consume Ice Cream',
      template: 'Are you sure you want to eat this ice cream?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  // An alert dialog
  $scope.showAlertas = function(titulo,mensaje) {
    var alertPopup = $ionicPopup.alert({
      title: titulo,
      template: mensaje
    });

    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
})

.controller('PreferenciaCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  // Set Header
  // $scope.$parent.showHeader();
  // $scope.$parent.clearFabs();
  // $scope.isExpanded = true;
  // $scope.$parent.setExpanded(false);
  // $scope.$parent.setHeaderFab(false);
  // Set Motion
  $timeout(function() {
    ionicMaterialMotion.slideUp({
      selector: '.slide-up'
    });
  }, 300);

  $timeout(function() {
    ionicMaterialMotion.fadeSlideInRight({
      startVelocity: 3000
    });
  }, 700);

  // Set Ink
  ionicMaterialInk.displayEffect();

$scope.SavePreferens = function(selected,valor){
  console.log(selected);
  if ($scope.valor === "active")
     $scope.class = "no-active";
   else
     $scope.class = "active";

};
})
.controller('MainCtrl', function($scope, $state) {
  /*$scope.eventos = [];
  $scope.isLoading = true;

  $scope.loadInfo = function (forceLoading){
  $scope.isLoading = true;

  if (forceLoading === undefined){
  forceLoading = false;
}

Competencias.getList(forceLoading).then(function(data){
$scope.isLoading = false;
$scope.eventos = data;
console.log(data);
});
};

$scope.showEvento = function(idEvento){
// console.log("Moviendose al evento " + idEvento);

$state.go('detalle_evento', {'eventoId': idEvento});
};

$scope.actualizarCompetencias = function(){
$scope.loadInfo(true);
};

$scope.toIntro = function(){
$state.go('intro');
};

console.log("Inicio");
$scope.loadInfo();
*/
})

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.isExpanded = false;
  $scope.hasHeaderFabLeft = false;
  $scope.hasHeaderFabRight = false;

  var navIcons = document.getElementsByClassName('ion-navicon');
  for (var i = 0; i < navIcons.length; i++) {
    navIcons.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }

  ////////////////////////////////////////
  // Layout Methods
  ////////////////////////////////////////

  $scope.hideNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  };

  $scope.showNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  };

  $scope.noHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setExpanded = function(bool) {
    $scope.isExpanded = bool;
  };

  $scope.setHeaderFab = function(location) {
    var hasHeaderFabLeft = false;
    var hasHeaderFabRight = false;

    switch (location) {
      case 'left':
      hasHeaderFabLeft = true;
      break;
      case 'right':
      hasHeaderFabRight = true;
      break;
    }

    $scope.hasHeaderFabLeft = hasHeaderFabLeft;
    $scope.hasHeaderFabRight = hasHeaderFabRight;
  };

  $scope.hasHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (!content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }

  };

  $scope.hideHeader = function() {
    $scope.hideNavBar();
    $scope.noHeader();
  };

  $scope.showHeader = function() {
    $scope.showNavBar();
    $scope.hasHeader();
  };

  $scope.clearFabs = function() {
    var fabs = document.getElementsByClassName('button-fab');
    if (fabs.length && fabs.length > 1) {
      fabs[0].remove();
    }
  };
})

// $scope.$parent.clearFabs();
// $timeout(function() {
//     $scope.$parent.hideHeader();
// }, 0);
// ionicMaterialInk.displayEffect();


.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('left');

  // Delay expansion
  $timeout(function() {
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
  }, 300);

  // Set Motion
  ionicMaterialMotion.fadeSlideInRight();

  // Set Ink
  ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = false;
  $scope.$parent.setExpanded(false);
  $scope.$parent.setHeaderFab(false);

  // Set Motion
  $timeout(function() {
    ionicMaterialMotion.slideUp({
      selector: '.slide-up'
    });
  }, 300);

  $timeout(function() {
    ionicMaterialMotion.fadeSlideInRight({
      startVelocity: 3000
    });
  }, 700);

  // Set Ink
  ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab('right');

  $timeout(function() {
    ionicMaterialMotion.fadeSlideIn({
      selector: '.animate-fade-slide-in .item'
    });
  }, 200);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  ionicMaterialMotion.pushDown({
    selector: '.push-down'
  });
  ionicMaterialMotion.fadeSlideInRight({
    selector: '.animate-fade-slide-in .item'
  });

})
/*
.factory('Api', function($http, restEndpoint) {
console.log('restEndpoint', restEndpoint)
var getApiData = function() {
return $http.get(restEndpoint.url + '/rest')
.then(function(data) {
console.log('Got some data: ', data);
return data;
});
};

return {
getApiData: getApiData
};
})*/
;
