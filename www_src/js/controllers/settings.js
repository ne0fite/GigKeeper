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

angular.module('GigKeeper').controller('settings', [
    '$scope', 'Settings', 'settings', 'BlockingPromiseManager',
    function($scope, Settings, settings, BlockingPromiseManager) {

        $scope.durationOptions = {
            decimals: 0,
            format: '0 minutes',
            min: 0,
            defaultValue: 0
        };

        $scope.form = {
            defaultDuration: settings.defaultDuration || 0,
            leadTime: settings.leadTime || 0,
            homeBasePlace: settings.homeBasePlace
        };

        $scope.submit = function(settingsForm) {
            if (!settingsForm.$invalid) {

                var button = angular.element('#save_button');
                button.button('loading');

                var payload = {
                    defaultDuration: $scope.form.defaultDuration,
                    leadTime: $scope.form.leadTime,
                    homeBasePlace: $scope.form.homeBasePlace
                };

                var request = Settings.data.update({}, payload).$promise.then(function() {
                    $scope.user.profile.defaultDuration = payload.defaultDuration;
                    $scope.user.leadTime = payload.leadTime;
                    $scope.user.homeBasePlace = payload.homeBasePlace;

                    button.button('reset');
                    $scope.alerts.push({
                        msg: 'Your settings were saved.',
                        type: 'success'
                    });
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