(function() {
    'use strict';

    angular.module('GigKeeper').factory('SoftErrorInterceptor', [
        '$uibModal',
        function($uibModal) {
            function showErrorModal(response) {
                window.test = response;
                var dialogSettings = Object.assign({
                    okText: 'OK',
                    cancelText: 'Cancel',
                    title: 'Confirm',
                    message: 'Are you sure?'
                }, dialogOptions);

                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/dialogs/confirm.html',
                    resolve: {
                        dialogSettings: function() {
                            return dialogSettings;
                        }
                    },
                    controller: [
                        '$scope', '$uibModalInstance', 'dialogSettings',
                        function($scope, $uibModalInstance, dialogSettings) {

                            $scope.dialogSettings = dialogSettings;

                            $scope.ok = function() {
                                $uibModalInstance.close();
                            };

                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    ]
                });
            }

            return {
                response: function (response) {
                    return response;
                },
                
                responseError: function(response) {
                    showErrorModal(response);

                    return $q.reject(response);
                }
            };
        }
    ]);
})();