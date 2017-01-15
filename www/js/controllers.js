var calendOrganize = angular.module('starter.controllers', ['ui.calendar', 'ui.bootstrap'])

        .controller('CalendarCtrl',
                function ($scope, $compile, $timeout, $uibModal, DataFactory, uiCalendarConfig) {
                    var date = new Date();
                    var d = date.getDate();
                    var m = date.getMonth();
                    var y = date.getFullYear();
                    var toSave = JSON.stringify($scope.synchronizationArray, null, '\t');
                    $scope.changeTo = 'Polish';
                    /* event source that pulls from google.com */
                    $scope.eventSource = {
                        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
                        className: 'gcal-event', // an option!
                        currentTimezone: 'America/Chicago' // an option!
                    };

                    $scope.synchronizationArray = [];
                    $scope.events = [];
                    $scope.getAllEvents = function () {
                        DataFactory.getAllEvents()
                                .success(function (data, status, headers, config) {
                                    for (var i = $scope.events.length; i >= 0; i--) {
                                        $scope.events.splice(i, 1);
                                    }
                                    angular.forEach(data, function (value, key) {
                                        $scope.events.push({
                                            id: value.idEvent,
                                            title: value.title,
                                            start: value.startDate,
                                            end: value.endDate
                                        });
                                        $scope.synchronizationArray.push(value);
                                    });
                                    console.dir($scope.events);
                                    $scope.writeFile();
                                }).error(function (data, status, headers, config) {
                            console.log(data);
                            $scope.readFile(false);

                        });
                    }

                    /* event source that contains custom events on the scope */
                    $scope.getAllEvents();
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
                                $scope.addEventModal(event, $scope.events, $scope.synchronizationArray)
                            },
                            eventClick: function (event) {
//                        console.log('Event clicking');
//                        console.dir(event);
                                $scope.editEventModal(event, $scope.events, $scope.synchronizationArray)
                            }
                        }
                    };

                    $scope.writeFile = function () {
                        var toSave = JSON.stringify($scope.synchronizationArray, null, '\t');
                        console.log(toSave);
                        var encoded = CryptoJS.AES.encrypt(toSave, CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c"), { iv: CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97") });
                        window.localStorage.setItem('edve', encoded);
                    }


                    $scope.synchronizationArray = [];
                    $scope.readFile = function (synchronizationBool) {
                        var stored = window.localStorage.getItem('edve');
                        if (typeof stored !== 'undefined' && stored) {
                            var cipherParams = CryptoJS.lib.CipherParams.create({
                                ciphertext: CryptoJS.enc.Base64.parse(stored.toString((CryptoJS.enc.Base64)))
                            });
                            var jsonString = CryptoJS.AES.decrypt(stored, CryptoJS.enc.Base64.parse("2b7e151628aed2a6abf7158809cf4f3c"), { iv: CryptoJS.enc.Base64.parse("3ad77bb40d7a3660a89ecaf32466ef97") }).toString(CryptoJS.enc.Utf8);
                            console.log(jsonString);
                            var jsData = JSON.parse(jsonString);
                            if (synchronizationBool) {
                                $scope.synchronizationArray = jsData;
                            } else {
                                $scope.synchronizationArray = jsData;
                                $scope.getAllEventsFromFile(jsData);
                            }
                        }
  
                    }

                    $scope.getAllEventsFromFile = function (jsData) {
                        for (var i = $scope.events.length; i >= 0; i--) {
                            $scope.events.splice(i, 1);
                        }
                        angular.forEach(jsData, function (value, key) {
                            var startDate = new Date(value.startDate);
                            var endDate = new Date(value.endDate);
                            if (startDate instanceof Date && isFinite(startDate) && endDate instanceof Date && isFinite(endDate)) {
                                $scope.events.push({
                                    id: value.idEvent,
                                    title: value.title,
                                    start: startDate.getTime(),
                                    end: endDate.getTime()
                                });
                            }
                        });
                    }

                    $scope.addEventModal = function (event, events, synchronizationArray) {
                        $uibModal.open({
                            templateUrl: 'templates/addEvent.html',
                            backdrop: false,
                            size: 'md',
                            controller: function ($scope, $uibModalInstance, getAllEvents, writeFile, readFile) {
                                $scope.events = events;
                                $scope.synchronizationArray = synchronizationArray;
                                var dateP = new Date(event);
                                var dateEndP = new Date(event);
                                var date = new Date(dateP.getUTCFullYear(), dateP.getUTCMonth(), dateP.getUTCDate(), dateP.getUTCHours(), dateP.getUTCMinutes(), dateP.getUTCSeconds());
                                var dateEnd = new Date(dateEndP.getUTCFullYear(), dateEndP.getUTCMonth(), dateEndP.getUTCDate(), dateEndP.getUTCHours(), dateEndP.getUTCMinutes(), dateEndP.getUTCSeconds());
                                dateEnd.setTime(dateEnd.getTime() + (1 * 60 * 60 * 1000));
                                $scope.addEvent = {
                                    idEvent: "",
                                    title: "",
                                    startDate: date,
                                    endDate: dateEnd,
                                    location: "",
                                }

                                $scope.add = function () {
                                    date.setTime(date.valueOf() - 60000 * date.getTimezoneOffset());
                                    dateEnd.setTime(dateEnd.valueOf() - 60000 * dateEnd.getTimezoneOffset());
                                    $scope.addEventToSave = {
                                        idEvent: "",
                                        title: "",
                                        startDate: date,
                                        endDate: dateEnd,
                                        location: "",
                                    }
                                    DataFactory.addEvent($scope.addEventToSave)
                                            .success(function (data, status, headers, config) {
                                                getAllEvents();
                                                $uibModalInstance.dismiss('cancel');
                                            }).error(function (data, status, headers, config) {
                                        $scope.synchronizationArray.push($scope.addEvent);
                                        writeFile();
                                        setTimeout(function () {
                                            readFile(false);
                                        }, 6000);
                                        $uibModalInstance.dismiss('cancel');
                                    });
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
                                synchronizationArray: function () {
                                    return $scope.synchronizationArray;
                                },
                                writeFile: function () {
                                    return $scope.writeFile;
                                },
                                readFile: function () {
                                    return $scope.readFile;
                                }
                            }
                        });
                    }

                    $scope.editEventModal = function (event, events, synchronizationArray) {
                        $uibModal.open({
                            templateUrl: 'templates/editEvent.html',
                            backdrop: false,
                            size: 'md',
                            controller: function ($scope, $uibModalInstance, getAllEvents, writeFile, readFile) {
                                $scope.event = event;
                                $scope.events = events;
                                $scope.synchronizationArray = synchronizationArray;

                                DataFactory.getEventById($scope.event.id)
                                        .success(function (data, status, headers, config) {
                                            var dateStartP = new Date(data.startDate);
                                            var dateStart = new Date(dateStartP.getUTCFullYear(), dateStartP.getUTCMonth(), dateStartP.getUTCDate(), dateStartP.getUTCHours(), dateStartP.getUTCMinutes(), dateStartP.getUTCSeconds());
                                            var dateEndP = new Date(data.endDate);
                                            var dateEnd = new Date(dateEndP.getUTCFullYear(), dateEndP.getUTCMonth(), dateEndP.getUTCDate(), dateEndP.getUTCHours(), dateEndP.getUTCMinutes(), dateEndP.getUTCSeconds());
                                            data.startDate = dateStart;
                                            data.endDate = dateEnd;
                                            $scope.editEvent = data;
                                        }).error(function (data, status, headers, config) {
                                    console.log(data);

                                    angular.forEach($scope.synchronizationArray, function (value, key) {
                                        var startDate = new Date(value.startDate);
                                        var startDate2 = new Date($scope.event.start);
                                        var endDate = new Date(value.endDate);
                                        var endDate2 = new Date($scope.event.endDate);
                                        //tak powino być ale nie wszystko działa
                                        //if (value.idEvent === $scope.event.id && startDate.getTime() === startDate2.getTime() && endDate.getTime() === endDate2.getTime() && value.title === $scope.event.title ) {
                                        if (value.idEvent === $scope.event.id && value.title === $scope.event.title) {
                                            value.startDate = startDate;
                                            value.endDate = endDate;
                                            $scope.editEvent = value;
                                        }
                                    });
                                });

                                $scope.edit = function () {
                                    var date = $scope.editEvent.startDate;
                                    var dateEnd = $scope.editEvent.endDate;
                                    date.setTime(date.valueOf() - 60000 * date.getTimezoneOffset());
                                    dateEnd.setTime(dateEnd.valueOf() - 60000 * dateEnd.getTimezoneOffset());
                                    $scope.editEvent.startDate = date;
                                    $scope.editEvent.endDate = dateEnd;
                                    DataFactory.editEvent($scope.editEvent)
                                            .success(function (data, status, headers, config) {
                                                getAllEvents();
                                                $uibModalInstance.dismiss('cancel');
                                            }).error(function (data, status, headers, config) {
                                        writeFile();
                                        setTimeout(function () {
                                            readFile(false);
                                        }, 6000);
                                        $uibModalInstance.dismiss('cancel');
                                    });
                                };

                                $scope.delete = function () {
                                    DataFactory.deleteEvent($scope.event.id)
                                            .success(function (data, status, headers, config) {
                                                getAllEvents();
                                                $uibModalInstance.dismiss('cancel');
                                            }).error(function (data, status, headers, config) {
                                        var iterator;
                                        angular.forEach($scope.synchronizationArray, function (value, key) {
                                            iterator++;
                                            if (value === $scope.editEvent) {
                                                $scope.synchronizationArray.splice(iterator, 1);
                                            }
                                        });
                                        writeFile();
                                        setTimeout(function () {
                                            readFile(false);
                                        }, 6000);
                                        $uibModalInstance.dismiss('cancel');
                                    });
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
                                },
                                synchronizationArray: function () {
                                    return $scope.synchronizationArray;
                                },
                                getAllEvents: function () {
                                    return $scope.getAllEvents;
                                },
                                writeFile: function () {
                                    return $scope.writeFile;
                                },
                                readFile: function () {
                                    return $scope.readFile;
                                }
                            }
                        });
                    }

                    $scope.synchronization = function () {
                        console.log('synchronization');
                        $scope.readFile(true);
                        console.dir($scope.synchronizationArray);
                        DataFactory.synchronization($scope.synchronizationArray)
                                .success(function (data, status, headers, config) {
                                    console.log('success');
                                    console.dir(data);
                                }).error(function (data, status, headers, config) {
                            console.log(data);
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
            $scope.setUserDetails(authenticated);
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
                    $state.go('main.dash', {}, {reload: true});
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
