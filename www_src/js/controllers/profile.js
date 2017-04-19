(function() {
    'use strict';

    angular.module('GigKeeper').controller('profile', [
        '$scope', '$http', 'UrlBuilder',
        function($scope, $http, UrlBuilder) {

            $scope.form = {};

            $http.get(UrlBuilder.build('/api/v1/user/profile')).then(function(response) {

                $scope.form.email = response.data.email;
                $scope.form.homeBaseAddress = response.data.profile.homeBaseAddress;

            }).catch(function(error) {
                console.error(error);
            });
        }
    ]);
})();