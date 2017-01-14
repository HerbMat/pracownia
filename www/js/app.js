// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


angular.module('starter', ['calendarOrganize', 'starter.controllers','starter.services','ionic','ngRoute', 'dataservices','ui.router'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    /*if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})






.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

	.state('calendar', {

		url: '/calendar',
		templateUrl: 'templates/calendar.html',
		controller: 'CalendarCtrl'
	})
    .state('login', {

        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('main', {

        url: '/',
        templateUrl: 'templates/home.html',
    })
    .state('main.dash', {
        url: 'main/dash',
        views: {
            'dash-tab': {
                templateUrl: 'templates/dashboard.html',
                controller: 'DashCtrl'
            }
        }
    })
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("main.dash");
    });

})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {

        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $state.go($state.current, {}, { reload: true });
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }

        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }
    });
})
