'use strict';

angular.module('dataservices', ['starter'])
        .factory('DataFactory', ['$http', '$rootScope', 'HeaderProvider','SERVER',
            function ($http, $rootScope, HeaderProvider, SERVER) {
                console.log(SERVER);
                var urlBase = SERVER;
                var dataFactory = {};
                var _headers = HeaderProvider.getHeader();
                dataFactory.getAllEvents = function () {
                    return $http.get(urlBase + '/event/getAll');
                };

                dataFactory.getEventById = function (eventId) {
                    return $http.get(urlBase + '/event/getOne?eventId=' + eventId, {
                        headers: _headers,
                    });
                };

                dataFactory.addEvent = function (event) {
                    return $http.post(urlBase + '/event/add', event, {
                        headers: _headers,
                    });
                };
                
                dataFactory.editEvent = function (event) {
                    return $http.post(urlBase + '/event/edit', event, {
                        headers: _headers,
                    });
                };

                dataFactory.deleteEvent = function (eventId) {
                    return $http.get(urlBase + '/event/delete?eventId=' + eventId, {
                        headers: _headers,
                    });
                };

                return dataFactory;
            }]);

﻿angular.module('starter.services', [])

.service('AuthService', function ($q, $http) {
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

    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function storeGoogleUserCredentials(grant) {
        authGrant = grant;
        window.localStorage.setItem(LOCAL_TOKEN_KEY, grant.idToken);

        username = grant.displayName;
        isAuthenticated = true;
        authToken = grant.idToken;
    }

    function useCredentials(token) {
        username = token.split('.')[0];
        isAuthenticated = true;
        authToken = token;

        // Set the token as header for your requests!
        $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        authGrant = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var login = function (name, pw) {
        return $q(function (resolve, reject) {
            if (name == 'user' && pw == '1') {
                // Make a request and receive your auth token from your server
                storeUserCredentials(name + '.yourServerToken');
                resolve('Login success.');
            } else {
                reject('Login Failed.');
            }
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
})

.provider('HeaderProvider', function () {

    this.$get = function () {
        return {
            getHeader: function () {
                return {
                    'Authorization': 'Bearer ' + 'yourTokenKey',// window.localStorage.getItem(LOCAL_TOKEN_KEY),
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
        };
    };
});
