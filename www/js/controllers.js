angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    $scope.username = AuthService.username();

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session Lost!',
            template: 'Sorry, You have to login again.'
        });
    });

    $scope.setUserDetails = function (data) {
        $scope.user = data;
    };
})

.controller('LoginCtrl', function ($scope, $state, $ionicPopup, AuthService) {
    $scope.data = {};

    $scope.login = function (data) {
        AuthService.login(data.username, data.password).then(function (authenticated) {
            $state.go('main.dash', {}, { reload: true });
            $scope.setUserDetails({
                username: data.username,
                imageUrl: 'https://pbs.twimg.com/profile_images/735571268641001472/kM_lPhzP.jpg'
            });
        }, function (err) {
            $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };

    $scope.loginGoogle = function () {
        AuthService.loginGoogle().then(function (data) {
            $scope.setUserDetails(data);
            $state.go('main.dash', {}, { reload: true });
        }, function (err) {
            $ionicPopup.alert({
                title: 'Login failed!',
                template: err
            });
        })
    };
})

.controller('DashCtrl', function ($scope, $state, $http, $ionicPopup, AuthService) {
    $scope.logout = function () {
        AuthService.logout();
        $state.go('login');
    };
});
