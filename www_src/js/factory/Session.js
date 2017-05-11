/**
 * @license
 * Copyright (C) 2017 Phoenix Bright Software, LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

/**
 * Session state management. Keeps a reference to the currently logged in user profile
 * and manages the setting / clearing the API token.
 */
angular.module('GigKeeper').factory('Session', [
    '$rootScope', '$state', 'Security', 'localStorageService', 'BlockingPromiseManager',
    function($rootScope, $state, Security, localStorageService, BlockingPromiseManager) {

        var Session = {

            user: null,

            /**
             * Start up the session by binding events and method callbacks.
             */
            start: function() {

                /**
                 * Whenever a state changes, check the session first. If valid, allow
                 * the state change. Otherwise, log them out, which sends them packing.
                 */
                $rootScope.$on('$stateChangeStart', function(event, toState) {

                    if (!toState.public) {

                        Session.check().then(function(result) {
                            if (!result) {
                                event.preventDefault();
                                $rootScope.logout();
                            }
                        }).catch(function(error) { // eslint-disable-line no-unused-vars
                            event.preventDefault();
                            $rootScope.logout();
                        });
                    }
                });

                /**
                 * Log the user out of the session and send them packing.
                 */
                $rootScope.logout = function() {
                    Session.logout().then(function() {
                        $state.go('home');
                    });
                };

                $rootScope.session = Session;
            },

            /**
             * Check the session by trying to get the user's profile.
             * If found, set the user on the session and return true.
             * Otherwise, return false.
             * @return {Promise<Boolean>}
             */
            check: function() {
                var request = Security.data.profile().$promise;

                request.then(function(user) {
                    if (user.active) {
                        Session.user = user;
                        return true;
                    } else {
                        Session.user = null;
                        return false;
                    }
                });

                BlockingPromiseManager.add(request);

                return request;
            },

            /**
             * Update the session from the response which should include
             * an apiToken property. Set the token in local storage and
             * update the Session.user object.
             * @param {Object}
             * @return {Void}
             */
            updateSession: function(userResponse) {
                localStorageService.set('apiToken', userResponse.apiToken);
                delete userResponse.apiToken;
                Session.user = userResponse;
            },

            /**
             * Log the user in to the API. On success, update the session
             * and return null. On failure, return the failure message.
             * @param {String} email
             * @param {String} password
             * @return {Promise<String>} message string on failure, null on success
             */
            login: function(email, password) {

                var postData = {
                    email: email,
                    password: password
                };

                var request = Security.data.login(postData).$promise;

                request.then(function(response) {
                    if (response.message) {
                        return new Error(response.message);
                    } else {
                        Session.updateSession(response);
                        return null;
                    }
                });

                BlockingPromiseManager.add(request);

                return request;
            },

            /**
             * Log the user out of the API and clear the session user and
             * API token from local storage.
             * @return {Promise}
             */
            logout: function() {

                var request = Security.data.logout().$promise;

                request.then(function(response) { // eslint-disable-line no-unused-vars
                    Session.user = null;
                    localStorageService.remove('apiToken');
                });

                BlockingPromiseManager.add(request);

                return request;
            }
        };

        return Session;
    }
]);
