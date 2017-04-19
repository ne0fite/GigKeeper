(function() {
    'use strict';

    angular.module('GigKeeper').run([
        '$rootScope', '$state', '$http',
        function($rootScope, $state, $http) {

            $rootScope.profile = false;

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                // TODO: how do we prevent checking auth on public pages, but still
                // check auth status on first load of any page??
                if (!toState.public) {
                    $http.get('/api/v1/user/profile').then(function(response) {
                        if (response.data.active) {
                            $rootScope.profile = response.data;
                        } else {
                            $rootScope.profile = null;
                            event.preventDefault();
                            $state.go('home');
                        }
                    }).catch(function(error) { // eslint-disable-line no-unused-vars
                        event.preventDefault();
                        $state.go('home');
                    });
                }
            });

            $rootScope.logout = function() {
                $http.post('/api/v1/logout').then(function(response) { // eslint-disable-line no-unused-vars
                    $rootScope.profile = null;
                    $state.go('home');
                }).catch(function(error) {
                    // TODO: flash error message
                    console.log(error);
                });
            };
        }]);

}());