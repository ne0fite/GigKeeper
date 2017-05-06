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

angular.module('GigKeeper').controller('HomeController', [
    '$rootScope', 'localStorageService', '$state', 'Security', 'UrlBuilder', 'BlockingPromiseManager',
    function($rootScope, localStorageService, $state, Security, UrlBuilder, BlockingPromiseManager) {

        var vm = this;

        vm.loginForm = {
            email: null,
            password: null
        };

        vm.submitLoginForm = function(loginForm) {
            vm.errorMessage = null;

            if (loginForm.$valid) {

                var postData = {
                    email: vm.loginForm.email,
                    password: vm.loginForm.password
                };

                var request = Security.data.login(postData).$promise;

                request.then(function(user) {
                    if (user.message) {
                        vm.errorMessage = user.message;
                    } else {
                        localStorageService.set('apiToken', user.apiToken);
                        delete user.apiToken;
                        $rootScope.user = user;
                        $state.go('gigs');
                    }
                }).catch(function(error) {
                    vm.errorMessage = error.message;
                });

                BlockingPromiseManager.add(request);
            }
        };
    }
]);