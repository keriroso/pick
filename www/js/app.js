//APP PICK
angular.module('pickplace', [
  'ionic',
  'pickplace.controllers',
  'pickplace.services',
  'ionic-material',
  'ngFacebook',
  'pickplace.loginfb'])
  .run(function($ionicPlatform,$window,$rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      if (window.localStorage.getItem("Usuario") != null && window.localStorage.getItem("SessionToken") != null
      && window.localStorage.getItem("SessionName") != null && window.localStorage.getItem("SessionId") != null) {
        $rootScope.usuario=angular.fromJson(getLocalVariable('Usuario'));
        console.log($rootScope.usuario);
        $window.location.href='#/tab/main';
      }
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    
    // Agregar SDK para login con Facebook
    (function(d){
      // load the Facebook javascript SDK
  
      var js,
      id = 'facebook-jssdk',
      ref = d.getElementsByTagName('script')[0];
  
      if (d.getElementById(id)) {
        return;
      }
  
      js = d.createElement('script');
      js.id = id;
      js.async = true;
      //js.src = "//connect.facebook.net/en_US/all.js";
      
      // ultima version:
      js.src = "//connect.facebook.net/en_US/sdk.js";
  
      ref.parentNode.insertBefore(js, ref);
  
    }(document));
    // FIN - Agregar SDK para login con Facebook



  })
  
  
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider, $facebookProvider) {

    Drupal.settings.site_path = "http://dev-pick-backend.pantheonsite.io";
    console.log(Drupal.settings.site_path);
    // Set the Service Resource endpoint path.
    Drupal.settings.endpoint = "rest";
    // Set to true to enable local storage caching for entities.
    Drupal.settings.cache.entity.enabled = true;
    // Number of seconds before cached copy expires. Set to 0 to cache forever, set
    // to 60 for one minute, etc.
    Drupal.settings.cache.entity.expiration = 60*60*24;
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);

    $stateProvider.state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('intro', {
      url: '/',
      templateUrl: 'templates/intro.html',
      controller: 'IntroCtrl'
    })
    .state('inicio', {
      url: '/inicio',
      templateUrl: 'templates/inicio.html',
      controller: 'UsuarioCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'UsuarioCtrl'
    })
    .state('registro', {
      url: '/registro',
      templateUrl: 'templates/registro.html',
      controller: 'UsuarioCtrl'
    })

    .state('preferencia', {
      url: '/preferencia',
      templateUrl: 'templates/preferencias.html',
      controller: 'PreferenciaCtrl'
    })
    // .state('tab.preferencia', {
    //   url: '/preferencia',
    //   views: {
    //     'tab-main': {
    //       templateUrl: 'templates/preferencias.html',
    //       controller: 'PreferenciaCtrl'
    //     }
    //   }
    // })
    .state('tab.main', {
      url: '/main',
      views: {
        'tab-main': {
          templateUrl: 'templates/main.html',
          controller: 'MainCtrl'
        }
      }
    })

    ;

    $urlRouterProvider.otherwise("/");
    
    // Configuraion para FB
    $facebookProvider.setAppId(1699914346942119);
    $facebookProvider.setPermissions("email,user_likes,public_profile");
    
    })
  
  ;
  
  
  
