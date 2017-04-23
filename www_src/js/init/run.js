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

angular.module('GigKeeper').run([
    '$rootScope', '$state', '$http', 'UrlBuilder', 'BlockingPromiseManager',
    function($rootScope, $state, $http, UrlBuilder, BlockingPromiseManager) {

        $rootScope.copyrightDate = new Date();
        
        $rootScope.BlockingPromiseManager = BlockingPromiseManager;

        $rootScope.profile = false;

        $rootScope.$on('$stateChangeStart', function(event, toState) { // eslint-disable-line no-unused-vars
            
            if (!toState.public) {

                var request = $http.get(UrlBuilder.build('/api/v1/user/profile')).then(function(response) {
                    if (response.data.active) {
                        $rootScope.profile = response.data;
                    } else {
                        $rootScope.profile = null;
                        event.preventDefault();
                        $state.go('home');
                    }
                }).catch(function(error) { // eslint-disable-line no-unused-vars
                    event.preventDefault();
                    $state.go('home');
                });

                BlockingPromiseManager.add(request);
            }
        });

        $rootScope.logout = function() {
            var request = $http.post(UrlBuilder.build('/api/v1/logout')).then(function(response) { // eslint-disable-line no-unused-vars
                $rootScope.profile = null;
                $state.go('home');
            }).catch(function(error) {
                // TODO: flash error message
                console.log(error);
            });

            BlockingPromiseManager.add(request);
        };
    }
]);