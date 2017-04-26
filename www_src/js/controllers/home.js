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

angular.module('GigKeeper').controller('home', [
    '$rootScope', '$scope', '$state', '$http', 'UrlBuilder', 'BlockingPromiseManager',
    function($rootScope, $scope, $state, $http, UrlBuilder, BlockingPromiseManager) {

        $scope.submitLoginForm = function(loginForm) {
            $scope.errorMessage = null;

            if (loginForm.$valid) {

                var postData = {
                    email: $scope.email,
                    password: $scope.password
                };

                var request = $http.post(UrlBuilder.build('/api/v1/login'), postData).then(function(response) {
                    if (response.status === 200) {
                        $rootScope.user = response.data;
                        $state.go('gigs');
                    } else {
                        $scope.errorMessage = response.data.message;
                    }
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                });

                BlockingPromiseManager.add(request);
            }
        };
    }
]);