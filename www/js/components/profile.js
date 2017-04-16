(function() {
    'use strict';

    angular.module('GigKeeper').component('profile', {
        templateUrl: 'profile.html',
        controller: function($scope, $http) {

            $scope.form = {};

            $http.get('/api/v1/user/profile').then(function(response) {

                $scope.form.email = response.data.email;
                $scope.form.homeBaseAddress = response.data.profile.homeBaseAddress;

            }).catch(function(error) {
                console.error(error);
            });
        }
    });
})();