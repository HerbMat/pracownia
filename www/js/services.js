'use strict';

angular.module('dataservices', [])
        .factory('DataFactory', ['$http', '$rootScope',
            function ($http, $rootScope) {

                var urlBase = 'http://localhost:8080';
                var dataFactory = {};

                dataFactory.getAllEvents = function () {
                    return $http.get(urlBase + '/event/getAll');
                };

                dataFactory.getEventById = function (eventId) {
                    return $http.get(urlBase + '/event/getOne?eventId='+eventId);
                };

                dataFactory.addEvent = function (event) {
                    return $http.post(urlBase + '/event/add', event);
                };
                
                dataFactory.editEvent = function (event) {
                    return $http.post(urlBase + '/event/edit', event);
                };

                dataFactory.deleteEvent = function (eventId) {
                    return $http.get(urlBase + '/event/delete?eventId='+eventId);
                };

                return dataFactory;
            }]);
