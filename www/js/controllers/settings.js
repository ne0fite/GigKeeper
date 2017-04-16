(function() {
    'use strict';

    angular.module('GigKeeper').controller('settings', [ '$scope', 'Settings', 'settings', function($scope, Settings, settings) {

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

                Settings.data.update({}, payload).$promise.then(function() {
                    button.button('reset');
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    button.button('reset');
                });
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };
    }]);
})();