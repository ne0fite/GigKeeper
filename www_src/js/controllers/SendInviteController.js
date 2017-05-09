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

angular.module('GigKeeper').controller('SendInviteController', [
    'Registration', 'Session', 'invites', 'Alerts',
    function(Registration, Session, invites, Alerts) {

        var vm = this;

        vm.form = {
            email: null,
            message: null
        };

        vm.gridOptions = {
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
                cellFilter: 'userNameDisplay:"' + Session.user.id + '"'
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

        vm.submit = function(sendInviteForm) {

            if (sendInviteForm.$valid) {

                var button = angular.element('#send_button');
                button.button('loading');

                var payload = {
                    email: vm.form.email,
                    message: vm.form.message
                };

                var request = Registration.data.sendInvite({}, payload).$promise;

                request.then(function(result) {

                    if (!result.error) {
                        Alerts.add('Invitation code ' + result.code + ' sent to ' + result.email, Alerts.constants.success);
                    } else {
                        Alerts.add(result.message, Alerts.constants.error);
                    }
                }).then(function() {
                    return Registration.data.index().$promise;
                }).then(function(invites) {
                    vm.gridOptions.data = invites;
                    button.button('reset');
                }).catch(function(error) {
                    Alerts.add(error.message, Alerts.constants.error);
                    button.button('reset');
                });

                //BlockingPromiseManager.add(request);
            } else {
                Alerts.add('Check form for errors', Alerts.constants.error);
            }
        };
    }
]);