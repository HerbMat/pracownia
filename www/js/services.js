'use strict';

angular.module('dataservices', [])
        .factory('DataFactory', ['$http', '$rootScope',
            function ($http, $rootScope, HeaderProvider) {
                var urlBase = 'localhost:8080';
                var dataFactory = {};
                dataFactory.getAllEvents = function () {
                    return $http.get(urlBase + '/event/getAll');
                };

                dataFactory.getEventById = function (eventId) {
                    return $http.get(urlBase + '/event/getOne?eventId=');
                };

                dataFactory.addEvent = function (event) {
                    return $http.post(urlBase + '/event/add', event);
                };
                
                dataFactory.editEvent = function (event) {
                    return $http.post(urlBase + '/event/edit', event);
                };

                dataFactory.deleteEvent = function (eventId) {
                    return $http.get(urlBase + '/event/delete?eventId=' + eventId);
                };

                return dataFactory;
            }]);

angular.module('starter.services', ['base64'])

.service('AuthService', function ($q, $http, $base64, SERVER) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var authToken;
    var authGrant;

    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token, name) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        username = name;
        isAuthenticated = true;

        // Set the token as header for your requests!
        $http.defaults.headers.common['Authorization'] = 'Bearer ' +  window.localStorage.getItem(LOCAL_TOKEN_KEY);
    }

    function storeGoogleUserCredentials(grant) {
        authGrant = grant;
        window.localStorage.setItem(LOCAL_TOKEN_KEY, grant.idToken);

        username = grant.displayName;
        isAuthenticated = true;
        authToken = grant.idToken;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem(LOCAL_TOKEN_KEY);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;

        // Set the token as header for your requests!
        $http.defaults.headers.common['Authorization'] = 'Bearer ' +  window.localStorage.getItem(LOCAL_TOKEN_KEY);
    }

    function destroyUserCredentials() {
        authToken = undefined;
        authGrant = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['Authorization'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function (name, pw) {
        return $q(function (resolve, reject) { 
            $http.post(SERVER + '/oauth/token?grant_type=client_credentials', {}, {
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(name + ':' + pw)
                }
            }).then(function (response) {
                alert()
                storeUserCredentials(response.access_token, name);
                resolve({
                    username: name,
                    imageUrl: 'https://pbs.twimg.com/profile_images/735571268641001472/kM_lPhzP.jpg'
                });
            }, function (err) {
                reject(err);
            });
        });
    };

    var loginGoogle = function() {
        return $q(function (resolve, reject) {
            window.plugins.googleplus.login(
            {
                'webClientId': '275882641505-h2jrsg9u0351a0userffkni3808ke92u.apps.googleusercontent.com'
            },
            function(grant) {
                storeGoogleUserCredentials(grant);
                resolve({
                    username: grant.displayName,
                    imageUrl: grant.imageUrl
                });
            },
            function (msg) {
                reject(msg);
            });
        });
    };

    var logout = function () {
        destroyUserCredentials();
    };

    loadUserCredentials();

    return {
        login: login,
        loginGoogle: loginGoogle,
        logout: logout,
        isAuthenticated: function () { return isAuthenticated; },
        username: function () { return username; }
    };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };
})
 
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});
