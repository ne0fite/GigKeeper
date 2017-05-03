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

angular.module('GigKeeper').controller('registerInvite', [
    '$rootScope', '$scope', 'localStorageService', '$state', 'Registration', 'invite', 'BlockingPromiseManager',
    function($rootScope, $scope, localStorageService, $state, Registration, invite, BlockingPromiseManager) {

        $scope.invite = invite;

        $scope.form = {
            email: invite.email,
            firstName: null,
            lastName: null,
            phone: null,
            password: null,
            passwordConfirm: null
        };

        $scope.submit = function(registerInviteForm) {

            if (registerInviteForm.$valid) {

                var button = angular.element('#register_button');
                button.button('loading');

                var payload = {
                    email: $scope.form.email,
                    firstName: $scope.form.firstName,
                    lastName: $scope.form.lastName,
                    phone: $scope.form.phone,
                    password: $scope.form.password,
                    passwordConfirm: $scope.form.passwordConfirm
                };

                var request = Registration.data.registerInvite({ code: invite.code }, payload).$promise;
                
                request.then(function(result) {

                    if (!result.error) {

                        localStorageService.set('apiToken', result.apiToken);
                        delete result.apiToken;
                        $rootScope.user = result;
                        $state.go('gigs');
                    } else {
                        $scope.errorMessage = result.message;
                    }
                    
                    button.button('reset');
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    button.button('reset');
                });

                BlockingPromiseManager.add(request);
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };
    }
]);