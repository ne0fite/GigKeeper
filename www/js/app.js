(function() {
    'use strict';

    angular.module('GigKeeper', [
        'ngResource',
        'ui.router',
        'kendo.directives',
        'google.places',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.selection'
    ]).config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider.state({
                name: 'home',
                url: '/',
                component: 'home',
                public: true
            }).state({
                name: 'my',
                url: '/my',
                component: 'my'
            }).state({
                name: 'my.gigs',
                url: '/gigs',
                controller: 'gigs',
                templateUrl: 'gigs.html',
                resolve: {
                    contractors: function(Contractor) {
                        return Contractor.data.index().$promise;
                    }
                }
            }).state({
                name: 'my.contractors',
                url: '/contractors',
                component: 'contractors'
            }).state({
                name: 'my.tags',
                url: '/tags',
                component: 'tags'
            }).state({
                name: 'my.settings',
                url: '/settings',
                controller: 'settings',
                templateUrl: 'settings.html',
                resolve: {
                    settings: function(Settings) {
                        return Settings.data.index().$promise;
                    }
                }
            }).state({
                name: 'about',
                url: '/about',
                component: 'about',
                public: true
            }).state('contact', {
                name: 'contact',
                url: '/contact',
                component: 'contact',
                public: true
            }).state({
                name: 'contractor',
                url: '/contractor',
                component: 'contractor'
            }).state({
                name: 'profile',
                url: '/profile',
                component: 'profile'
            });
        }
    ]).run(['$rootScope', '$state', '$http', function($rootScope, $state, $http) {

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
                }).catch(function(error) {
                    event.preventDefault();
                    $state.go('home');
                });
            }
        });

        $rootScope.logout = function() {
            $http.post('/api/v1/logout').then(function(response) {
                $rootScope.profile = null;
                $state.go('home');
            }).catch(function(error) {
                // TODO: flash error message
                console.log(error);
            })
        };
    }]);

}());