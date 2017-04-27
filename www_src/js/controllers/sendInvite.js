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

angular.module('GigKeeper').controller('sendInvite', [
    '$scope', '$state', 'Registration', 'invites',
    function($scope, $state, Registration, invites) {

        $scope.form = {
            email: null,
            message: null
        };

        $scope.gridOptions = {
            enableFiltering: true,
            enableGridMenu: true,
            enableRowSelection: false,
            enableSelectAll: false,
            multiSelect: false,
            enableRowHeaderSelection: false,
            enableSorting: true,
            noUnselect: true,
            columnDefs: [{
                name: 'Email',
                field: 'email',
                type: 'string'
            }, {
                name: 'Code',
                field: 'code',
                type: 'string',
                enableFiltering: false
            }, {
                name: 'Sent By',
                field: 'user',
                type: 'string',
                visible: false,
                cellFilter: 'userNameDisplay:"' + $scope.user.id + '"'
            }, {
                name: 'Message',
                field: 'message',
                type: 'string',
                visible: false
            }, {
                name: 'Sent Date',
                field: 'createdAt',
                type: 'date',
                cellFilter: 'date:"MM/dd/yyyy hh:mm a"'
            }, {
                name: 'Registered',
                field: 'registeredAt',
                type: 'date',
                cellFilter: 'date:"MM/dd/yyyy hh:mm a"'
            }],
            data: invites
        };

        $scope.submit = function(sendInviteForm) {

            if (sendInviteForm.$valid) {

                var button = angular.element('#send_button');
                button.button('loading');

                var payload = {
                    email: $scope.form.email,
                    message: $scope.form.message
                };

                var request = Registration.data.sendInvite({}, payload).$promise;

                request.then(function(result) {

                    if (!result.error) {
                        $scope.successMessage = 'Invitation code ' + result.code + ' sent to ' + result.email;
                    } else {
                        $scope.errorMessage = result.message;
                    }
                }).then(function() {
                    return Registration.data.index().$promise;
                }).then(function(invites) {
                    $scope.gridOptions.data = invites;
                    button.button('reset');
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    button.button('reset');
                });

                //BlockingPromiseManager.add(request);
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };
    }
]);