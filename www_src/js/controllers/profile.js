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

angular.module('GigKeeper').controller('profile', [
    '$scope', '$http', 'UrlBuilder', 'BlockingPromiseManager', 'Profile', 'profile',
    function($scope, $http, UrlBuilder, BlockingPromiseManager, Profile, profile) {

        $scope.form = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone
        };

        $scope.submit = function(profileForm) {
            $scope.errorMessage = null;
            $scope.successMessage = null;

            if (!profileForm.$invalid) {

                var payload = {
                    firstName: $scope.form.firstName,
                    lastName: $scope.form.lastName,
                    email: $scope.form.email,
                    phone: $scope.form.phone,
                    password: $scope.form.password || null,
                    passwordConfirm: $scope.form.passwordConfirm || null
                };

                Profile.data.update({}, payload).$promise.then(function() {
                    $scope.successMessage = 'Saved!';
                }).catch(function(err) {
                    $scope.errorMessage = err.message;
                }).finally(function() {
                    $scope.form.password = null;
                    $scope.form.passwordConfirm = null;
                });
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };
    }
]);