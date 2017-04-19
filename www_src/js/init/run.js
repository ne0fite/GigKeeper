(function() {
    'use strict';

    angular.module('GigKeeper').run([
        '$rootScope', '$state', '$http', 'UrlBuilder',
        function($rootScope, $state, $http, UrlBuilder) {

            $rootScope.profile = false;

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                // TODO: how do we prevent checking auth on public pages, but still
                // check auth status on first load of any page??
                if (!toState.public) {
                    $http.get(UrlBuilder.build('/api/v1/user/profile')).then(function(response) {
                        if (response.data.active) {
                            $rootScope.profile = response.data;
                        } else {
                            $rootScope.profile = null;
                            event.preventDefault();
                            $state.go('home');
                        }
                    }).catch(function(error) {
                        event.preventDefault();
                        $state.go('home');
                    });
                }
            });

            $rootScope.logout = function() {
                $http.post(UrlBuilder.build('/api/v1/logout')).then(function(response) {
                    $rootScope.profile = null;
                    $state.go('home');
                }).catch(function(error) {
                    // TODO: flash error message
                    console.log(error);
                });
            };
        }
    ]);
}());