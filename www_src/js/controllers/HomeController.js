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
    'localStorageService', '$state', 'Session',
    function(localStorageService, $state, Session) {

        var vm = this;

        vm.session = Session;

        vm.loginForm = {
            email: null,
            password: null
        };

        vm.submitLoginForm = function(loginForm) {
            vm.errorMessage = null;

            if (loginForm.$valid) {

                Session.login(vm.loginForm.email, vm.loginForm.password).then(function(error) {
                    if (error) {
                        vm.errorMessage = error.message;
                    } else {
                        $state.go('gigs');
                    }
                });
            }
        };
    }
]);