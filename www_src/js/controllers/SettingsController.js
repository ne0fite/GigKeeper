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

angular.module('GigKeeper').controller('SettingsController', [
    'Settings', 'settings', 'BlockingPromiseManager', 'Alerts',
    function(Settings, settings, BlockingPromiseManager, Alerts) {

        var vm = this;

        vm.durationOptions = {
            decimals: 0,
            format: '0 minutes',
            min: 0,
            defaultValue: 0
        };

        vm.form = {
            defaultDuration: settings.defaultDuration || 0,
            leadTime: settings.leadTime || 0,
            homeBasePlace: settings.homeBasePlace
        };

        vm.submit = function(settingsForm) {
            if (!settingsForm.$invalid) {

                var button = angular.element('#save_button');
                button.button('loading');

                var payload = {
                    defaultDuration: vm.form.defaultDuration,
                    leadTime: vm.form.leadTime,
                    homeBasePlace: vm.form.homeBasePlace
                };

                var request = Settings.data.update({}, payload).$promise.then(function() {
                    button.button('reset');
                    Alerts.add('Your settings were saved.', Alerts.constants.success);
                }).catch(function(error) {
                    Alerts.add(error.message, 'error');
                    button.button('reset');
                });

                BlockingPromiseManager.add(request);
            } else {
                Alerts.add('Check form for errors', 'error');
            }
        };
    }
]);