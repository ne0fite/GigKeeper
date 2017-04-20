(function() {
    'use strict';

    angular.module('GigKeeper').controller('profile', [
        '$scope', '$http', 'UrlBuilder', 'BlockingPromiseManager',
        function($scope, $http, UrlBuilder, BlockingPromiseManager) {

            $scope.form = {};

            var request = $http.get(UrlBuilder.build('/api/v1/user/profile')).then(function(response) {

                $scope.form.email = response.data.email;
                $scope.form.homeBaseAddress = response.data.profile.homeBaseAddress;

            }).catch(function(error) {
                console.error(error);
            });

            BlockingPromiseManager.add(request);
        }
    ]);
})();