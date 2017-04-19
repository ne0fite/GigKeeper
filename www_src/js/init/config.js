(function() {
    'use strict';

    angular.module('GigKeeper').config([
        '$stateProvider', '$urlRouterProvider', '$titleProvider',
        function($stateProvider, $urlRouterProvider, $titleProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider.state({
                name: 'home',
                url: '/',
                controller: 'home',
                templateUrl: '/template/home.html',
                public: true,
                resolve: {
                    $title: function() {
                        return 'Home';
                    }
                }
            }).state({
                name: 'my',
                url: '/my',
                templateUrl: '/template/my.html',
                resolve: {
                    $title: function() {
                        return 'My Stuff';
                    }
                }
            }).state({
                name: 'my.gigs',
                url: '/gigs',
                controller: 'gigs',
                templateUrl: '/template/gigs.html',
                resolve: {
                    contractors: [
                        'Contractor',
                        function(Contractor) {
                            return Contractor.data.index().$promise;
                        }
                    ],
                    $title: function() {
                        return 'My Gigs';
                    }
                }
            }).state({
                name: 'my.contractors',
                url: '/contractors',
                controller: 'contractors',
                templateUrl: '/template/contractors.html',
                resolve: {
                    $title: function() {
                        return 'My Contractors';
                    }
                }
            }).state({
                name: 'my.tags',
                url: '/tags',
                controller: 'tags',
                templateUrl: '/template/tags.html',
                resolve: {
                    $title: function() {
                        return 'My Tags';
                    }
                }
            }).state({
                name: 'my.settings',
                url: '/settings',
                controller: 'settings',
                templateUrl: '/template/settings.html',
                resolve: {
                    settings: [
                        'Settings',
                        function(Settings) {
                            return Settings.data.index().$promise;
                        }
                    ], 
                    $title: function() {
                        return 'Settings';
                    }
                }
            }).state({
                name: 'profile',
                url: '/profile',
                controller: 'profile',
                templateUrl: '/template/profile.html',
                resolve: {
                    $title: function() {
                        return 'My Profile';
                    }
                }
            });

            $titleProvider.documentTitle([
                '$rootScope',
                function($rootScope) {
                    var title = 'GigKeeper';
                    if ($rootScope.$title) {
                        title = $rootScope.$title + ' - ' + title;
                    }
                    return title;
                }
            ]);
        }
    ]);

}());