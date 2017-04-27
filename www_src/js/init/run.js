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
    '$rootScope', '$state', '$sce', 'Security', 'UrlBuilder', 'BlockingPromiseManager',
    function($rootScope, $state, $sce, Security, UrlBuilder, BlockingPromiseManager) {

        $rootScope.copyrightDate = new Date();
        
        $rootScope.$sce = $sce;
        $rootScope.BlockingPromiseManager = BlockingPromiseManager;

        $rootScope.user = null;
        $rootScope.alerts = [];

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            if (!toState.public) {

                var request = Security.data.profile().$promise;

                request.then(function(user) {
                    if (user.active) {
                        $rootScope.user = user;
                    } else {
                        $rootScope.user = null;
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
            var request = Security.data.logout().$promise;
            request.then(function(response) { // eslint-disable-line no-unused-vars
                $rootScope.user = null;
                $state.go('home');
            }).catch(function(error) {
                $rootScope.alerts.push({
                    msg: error.message,
                    type: 'error'
                });
            });

            BlockingPromiseManager.add(request);
        };
    }
]);