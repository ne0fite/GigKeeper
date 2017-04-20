(function() {
    'use strict';

    angular.module('GigKeeper').controller('profile', [
        '$scope', '$http', 'UrlBuilder', 'Profile', 'profile',
        function($scope, $http, UrlBuilder, Profile, profile) {

            $scope.form = {
                email: profile.email
            };

            $scope.submit = function(profileForm) {
                $scope.errorMessage = null;
                $scope.successMessage = null;

                if (!profileForm.$invalid) {

                    var payload = {
                        email: $scope.form.email,
                        password: $scope.form.password || null,
                        passwordConfirm: $scope.form.passwordConfirm || null
                    };

                    Profile.data.update({}, payload).$promise.then(function() {
                        $scope.successMessage = 'Saved!';
                    }).catch(function(err) {
                        console.log(err);
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
})();