/* global angular, document, window */
'use strict';
angular.module('pickplace.controllers', ['pickplace.services','angular.filter'])
/*
INTRO
Controlador para el intro de pick
*/
.constant('WebservicesURL','http://dev-pick-backend.pantheonsite.io')

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
  var intro = getLocalVariable('Intro');
  if (intro) {
    $window.location.href='#/inicio';
  }

})
/*
LOGIN
Funcion de inicio de sesion
*/
.controller('UserCtrl', function($scope,$sce,$timeout,$state, $stateParams,$http, ionicMaterialInk,$rootScope,Login,$window,$ionicModal,$ionicPopup) {
  //inicio session de facebook
  $scope.$on('UserFacebook', function(event,args) {
    $scope.userData = args.user;
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

    $scope.createAccount(userName,userEmail,userId,facebook);
  });

  //funcion para inicio de session
  $scope.login = function(user1,pass) {
    $scope.isLoading = true;
    if(user1!=null && pass!=null){
      Login.getSession(true,user1,pass).then(function(data){
        console.log(data);
        $scope.isLoading = false;
        $rootScope.usuario=data;
        console.log(window.localStorage.getItem('preferenciaVista'));
        if(window.localStorage.getItem('preferenciaVista')){
          $state.go('tab.main');
        }else{
          $state.go('preferencia');
        }
      }).catch(function(data) {
        $scope.showAlertas('Error',data);
        $scope.isLoading = false;
      });
    }else{
      $scope.showAlertas('Error','Ingrese los campos vacíos');
      $scope.isLoading = false;
    }
  };
  $scope.eliminarSession = function(cargar) {
    $scope.isLoading = true;
    var token=localStorage.getItem('SessionToken');
    var options= {
      uid:$rootScope.usuario.uid,
      'X-CSRF-Token' : token,
    }
    if(cargar){
      user_logout(options,{
        success:function(result){
          if (result[0]) {
            console.log("Logged out!");
          }
        }
        ,error:function(xhr,status,message){
          // console.log(xhr);
          // console.log(message);
        }
      });
      localStorage.removeItem("User");
      localStorage.removeItem("SessionId");
      localStorage.removeItem("SessionName");
      localStorage.removeItem("SessionToken");
      setLocalVariable("User",null);
      $scope.isLoading = false;
      $window.location.href='#/inicio';
    }
    $scope.isLoading = false;
  };
  $scope.createAccount = function(nombre,correo,clave,facebook){
    $scope.isLoading = true;
    var account = {
      name:nombre,
      mail:correo,
      pass:clave
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
        if(facebook==true){
          $scope.login(nombre,clave);
        }else {
        $scope.showAlertas('Formulario',$scope.msg);
        }

      }
    });
  };

  /*
  *  Usuario - Edicion
  */
  $scope.userUpdate= function(und){
    var session_name= angular.fromJson(localStorage.getItem("SessionName"));
    var sessid = angular.fromJson(localStorage.getItem("SessionId"));

    var token=angular.fromJson(localStorage.getItem('SessionToken'));
    console.log('UND object : ', und);

    var preferencias_array = [];

    var item_language = [];

    angular.forEach(und,function(value){
      var item = [];
      item.target_id = value;
      //preferencias_array.und.push(item);
      item_language.push(item);
    });

    preferencias_array.push(item_language);

    var account = {
      uid:$rootScope.usuario.uid,
      field_preferencias: und,

    };
    user_update_pick(account, {
      success:function(result) {
        setLocalVariable('preferenciaVista',true);
        $state.go('tab.main');
      },
      error:function(xhr,status,message){
        console.log(xhr);
        console.log(message);
        $scope.showAlertas('Error',message);
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
  $scope.registerApp = function() {
    $state.go('registro');
  };
  $scope.loginApp = function() {
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

.controller('PreferencesCtrl', function($rootScope,$scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,Preferences) {

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
  //extract storage user
  var PreferenceUser=JSON.parse(localStorage.getItem("User"));
  // Item List Arrays
  $scope.preferencesSelected = [];
  if(!angular.isUndefined(PreferenceUser.field_preferencias.und)){
  if(PreferenceUser.field_preferencias.und.length>0){
    angular.forEach(PreferenceUser.field_preferencias.und,function(key,value){
        console.log(key.target_id);
        $scope.preferencesSelected.push(key.target_id);
    });
  }else {
    $scope.preferencesSelected = [];
  }
}
  console.log($scope.preferencesSelected );
  $scope.SavePreferences = function (valorpid,valorcid) {

    if ($scope.preferencesSelected.indexOf(valorpid) >= 0) {
      var i = $scope.preferencesSelected.indexOf(valorpid);
      $scope.preferencesSelected.splice(i, 1);
    }
    else {
      $scope.preferencesSelected.push(valorpid);

    }
    console.log($scope.preferencesSelected);

  };

  $scope.containsObject= function(valor) {
    $scope.indexDelete='';
    var i;
    for (i = 0; i < $scope.preferencesSelected.length; i++) {
      if($scope.preferencesSelected[i].target_id == valor){
        return false;
      }
    }
    return true;
  };
  $scope.searchPreferences = function(valor){
    var i;
    for (i = 0; i < $scope.preferencesSelected.length; i++) {
      if ($scope.preferencesSelected.indexOf(valor) >= 0) {
        //if($scope.preferencesSelected[i].target_id == valor){
        return true;
      }
    }
    return false;
  };
  $scope.list_preferences = [];
  $scope.isLoading = true;

  $scope.loadEvent = function (forceLoading){
    $scope.isLoading = true;

    if (forceLoading === undefined){
      forceLoading = false;
    }
    Preferences.getList(forceLoading).then(function(data){
      $scope.list_preferences = data;
      console.log(data);
      $scope.isLoading = false;
    });
  };
})
.controller('MainCtrl', function($scope, $state) {

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
;
