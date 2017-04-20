(function() {
    'use strict';

    angular.module('GigKeeper').controller('settings', [
        '$scope', 'Settings', 'settings', 'BlockingPromiseManager',
        function($scope, Settings, settings, BlockingPromiseManager) {

            $scope.homeBaseOptions = {
                placeIdOnly: true
            };

            $scope.form = {
                homeBasePlace: settings.homeBasePlace
            };

            $scope.submit = function(settingsForm) {
                if (!settingsForm.$invalid) {

                    var button = angular.element('#save_button');
                    button.button('loading');

                    var payload = {
                        homeBasePlace: $scope.form.homeBasePlace
                    };

                    var request = Settings.data.update({}, payload).$promise.then(function() {
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
})();