(function() {
    'use strict';

    angular.module('GigKeeper').controller('home', [
        '$rootScope', '$scope', '$state', '$http', 'UrlBuilder', 'BlockingPromiseManager',
        function($rootScope, $scope, $state, $http, UrlBuilder, BlockingPromiseManager) {

            $scope.submitLoginForm = function(loginForm) {
                if (loginForm.$valid) {

                    var postData = {
                        email: $scope.email,
                        password: $scope.password
                    };

                    var request = $http.post(UrlBuilder.build('/api/v1/login'), postData).then(function(response) {
                        if (response.status === 200) {
                            $rootScope.profile = response.data;
                            $state.go('my.gigs');
                        } else {
                            alert('Bad username or password');
                        }
                    }).catch(function(error) {
                        if (error.data && error.data.message) {
                            alert(error.data.message);
                        } else {
                            alert('System error');
                        }
                    });

                    BlockingPromiseManager.add(request);
                }
            };
        }
    ]);
}());