var calendOrganize = angular.module('starter.controllers', ['ui.calendar', 'ui.bootstrap'])

.controller('CalendarCtrl',
        function ($scope, $compile, $timeout, $uibModal, DataFactory, uiCalendarConfig,$route) {
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $scope.changeTo = 'Polish';
            /* event source that pulls from google.com */
            $scope.eventSource = {
                url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
                className: 'gcal-event', // an option!
                currentTimezone: 'America/Chicago' // an option!
            };

            $scope.events = [];
            $scope.getAllEvents = function () {
                DataFactory.getAllEvents()
                        .success(function (data, status, headers, config) {
                            console.dir($scope.events);
                            console.dir('Get all');
                            console.dir(data);
                            angular.forEach(data, function (value, key) {
                                $scope.events.push({
                                    id: value.idEvent,
                                    title: value.title,
                                    start: value.startDate,
                                    end: value.endDate
                                });
                            });
                            $scope.events = data;
                            $route.reload();
                        }).error(function (data, status, headers, config) {
                    console.log(data);
                });
            }

            /* event source that contains custom events on the scope */
            $scope.getAllEvents();
//            $scope.events = [
//                {id: 10, title: 'All Day Event', start: new Date(y, m, 1)},
//                {id: 1, title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
//                {id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false},
//                {id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false},
//                {id: 2, title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false},
//                {id: 4, title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
//            ];
            /* event source that calls a function on every view switch */
            $scope.eventsF = function (start, end, timezone, callback) {
                var s = new Date(start).getTime() / 1000;
                var e = new Date(end).getTime() / 1000;
                var m = new Date(start).getMonth();
                var events = [{title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed']}];
                callback(events);
            };

            $scope.calEventsExt = {
                color: '#f00',
                textColor: 'yellow',
                events: [
                    {type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
                    {type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
                    {type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
                ]
            };
            /* alert on eventClick */
            $scope.alertOnEventClick = function (date, jsEvent, view) {
                $scope.alertMessage = (date.title + ' was clicked ');
            };
            /* alert on Drop */
            $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
                $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
                $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };
            /* add and removes an event source of choice */
            $scope.addRemoveEventSource = function (sources, source) {
                var canAdd = 0;
                angular.forEach(sources, function (value, key) {
                    if (sources[key] === source) {
                        sources.splice(key, 1);
                        canAdd = 1;
                    }
                });
                if (canAdd === 0) {
                    sources.push(source);
                }
            };
            /* add custom event*/
            $scope.addEvent = function () {
                $scope.events.push({
                    title: 'Open Sesame',
                    start: new Date(y, m, 28),
                    end: new Date(y, m, 29),
                    className: ['openSesame']
                });
            };
            /* remove event */
            $scope.remove = function (index) {
                $scope.events.splice(index, 1);
            };
            /* Change View */
            $scope.changeView = function (view, calendar) {
                uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
            };
            /* Change View */
            $scope.renderCalendar = function (calendar) {
                $timeout(function () {
                    if (uiCalendarConfig.calendars[calendar]) {
                        uiCalendarConfig.calendars[calendar].fullCalendar('render');
                    }
                });
            };
            /* Render Tooltip */
            $scope.eventRender = function (event, element, view) {
                element.attr({'tooltip': event.title,
                    'tooltip-append-to-body': true});
                $compile(element)($scope);
            };
            /* config object */
            $scope.uiConfig = {
                calendar: {
                    height: 450,
                    editable: true,
                    header: {
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    },
                    eventClick: $scope.alertOnEventClick,
                    eventDrop: $scope.alertOnDrop,
                    eventResize: $scope.alertOnResize,
                    eventRender: $scope.eventRender
                }
            };

            $scope.changeLang = function () {
                if ($scope.changeTo === 'Hungarian') {
                    $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
                    $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
                    $scope.changeTo = 'English';
                } else {
                    $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    $scope.changeTo = 'Hungarian';
                }
            };
            /* event sources array*/
            $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
            $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

            $scope.uiConfig = {
                calendar: {
                    dayClick: function (event) {
                        //console.log('Day clicking' + event);
                        $scope.addEventModal(event, $scope.events)
                    },
                    eventClick: function (event) {
//                        console.log('Event clicking');
//                        console.dir(event);
                        $scope.editEventModal(event, $scope.events)
                    }

                }
            };

            $scope.addEventModal = function (event, events) {
                $uibModal.open({
                    templateUrl: 'templates/addEvent.html',
                    backdrop: false,
                    size: 'md',
                    controller: function ($scope, $uibModalInstance, getAllEvents) {
//                        console.dir('Events');
//                        console.dir(events);
                        $scope.events = events;
                        var date = new Date(event);
                        var dateEnd = new Date(event);
                        dateEnd.setTime(dateEnd.getTime() + (1 * 60 * 60 * 1000));
//                        var d = date.getDate();
//                        var m = date.getMonth();
//                        var y = date.getFullYear();
                        $scope.addEvent = {
                            idEvent: "",
                            title: "",
                            startDate: date,
                            endDate: dateEnd,
                            location: "",
                        }

                        $scope.add = function () {
                            //console.dir($scope.addEvent);
                            DataFactory.addEvent($scope.addEvent)
                                    .success(function (data, status, headers, config) {
//                                        console.dir('Event added');
//                                        console.dir(data);
//                                        $scope.events.push({
//                                            id: data.idEvent,
//                                            title: data.title,
//                                            start: data.startDate,
//                                            end: data.endDate
//                                        });
                                        getAllEvents();
                                        $uibModalInstance.dismiss('cancel');
                                    }).error(function (data, status, headers, config) {
                                console.log(data);
                            });


                            // $uibModalInstance.close({type: 'party', id: 999, title: 'Added from modal', start: new Date(y, m, d, 16, 0), allDay: false});
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        events: function () {
                            return $scope.events;
                        },
                         getAllEvents: function () {
                        return $scope.getAllEvents;
                    },
                    }
                });
            }

            $scope.editEventModal = function (event, events) {
                $uibModal.open({
                    templateUrl: 'templates/editEvent.html',
                    backdrop: false,
                    size: 'md',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.event = event;
                        $scope.events = events;
//                        console.dir($scope.event);
//                        console.dir($scope.event.id);
                        DataFactory.getEventById($scope.event.id)
                                .success(function (data, status, headers, config) {
//                                    console.dir('Event get');
//                                    console.dir(data);
                                    var dateStart = new Date(data.startDate);
                                    var dateEnd = new Date(data.endDate);
                                    data.startDate = dateStart;
                                    data.endDate = dateEnd;
                                    $scope.editEvent = data;

                                }).error(function (data, status, headers, config) {
                            console.log(data);
                        });

                        $scope.edit = function () {

                            //console.dir($scope.editEvent);
                            DataFactory.editEvent($scope.editEvent)
                                    .success(function (data, status, headers, config) {
//                                        console.dir('Event edited');
//                                        console.dir(data);
//                                        $scope.events.push({
//                                            id: data.idEvent,
//                                            title: data.title,
//                                            start: data.startDate,
//                                            end: data.endDate
//                                        });
//                                        console.dir($scope.events);
                                        $scope.getAllEvents();
                                        $uibModalInstance.dismiss('cancel');
                                    }).error(function (data, status, headers, config) {
                                console.log(data);
                            });
                            //$uibModalInstance.close({type: 'party', id: 999, title: 'Added from modal', start: new Date(y, m, d, 16, 0), allDay: false});
                        };

                        $scope.delete = function () {

                            DataFactory.deleteEvent($scope.event.id)
                                    .success(function (data, status, headers, config) {
                                        // console.dir('Deleted');
                                        //console.dir(data);
                                        $scope.getAllEvents();
                                        $uibModalInstance.dismiss('cancel');
                                    }).error(function (data, status, headers, config) {
                                console.log(data);
                            });
                            //$uibModalInstance.close({type: 'party', id: 999, title: 'Added from modal', start: new Date(y, m, d, 16, 0), allDay: false});
                        };



                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        events: function () {
                            return $scope.events;
                        },
                        event: function () {
                            return $scope.event;
                        }
                    }
                });
            }
        })

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

    $scope.logout = function () {
        AuthService.logout();
        $state.go('login');
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

});
