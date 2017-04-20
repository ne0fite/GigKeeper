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

angular.module('GigKeeper').controller('TagEditController', [
    '$scope', '$uibModalInstance', 'Tag', 'tag', 'BlockingPromiseManager',
    function($scope, $uibModalInstance, Tag, tag, BlockingPromiseManager) {

        $scope.form = {
            id: tag.id,
            name: tag.name,
            description: tag.description
        };

        $scope.submit = function(tagForm) {

            if (!tagForm.$invalid) {

                var button = angular.element('#save_button');
                button.button('loading');

                var payload = {
                    name: $scope.form.name,
                    description: $scope.form.description
                };

                var promise;
                if (tag.id) {
                    promise = Tag.data.update({ id: tag.id }, payload).$promise;
                } else {
                    promise = Tag.data.create({}, payload).$promise;
                }

                promise.then(function() {
                    $uibModalInstance.close();
                    button.button('reset');
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    button.button('reset');
                });

                BlockingPromiseManager.add(promise);
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);