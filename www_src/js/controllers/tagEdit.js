(function() {
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
})();