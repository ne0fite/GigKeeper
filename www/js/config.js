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
                templateUrl: 'home.html',
                public: true,
                resolve: {
                    $title: function() {
                        return 'Home';
                    }
                }
            }).state({
                name: 'my',
                url: '/my',
                templateUrl: 'my.html',
                resolve: {
                    $title: function() {
                        return 'My Stuff';
                    }
                }
            }).state({
                name: 'my.gigs',
                url: '/gigs',
                controller: 'gigs',
                templateUrl: 'gigs.html',
                resolve: {
                    contractors: function(Contractor) {
                        return Contractor.data.index().$promise;
                    },
                    $title: function() {
                        return 'My Gigs';
                    }
                }
            }).state({
                name: 'my.contractors',
                url: '/contractors',
                controller: 'contractors',
                templateUrl: 'contractors.html',
                resolve: {
                    $title: function() {
                        return 'My Contractors';
                    }
                }
            }).state({
                name: 'my.tags',
                url: '/tags',
                controller: 'tags',
                templateUrl: 'tags.html',
                resolve: {
                    $title: function() {
                        return 'My Tags';
                    }
                }
            }).state({
                name: 'my.settings',
                url: '/settings',
                controller: 'settings',
                templateUrl: 'settings.html',
                resolve: {
                    settings: function(Settings) {
                        return Settings.data.index().$promise;
                    }, 
                    $title: function() {
                        return 'Settings';
                    }
                }
            }).state({
                name: 'about',
                url: '/about',
                templateUrl: 'about.html',
                resolve: {
                    $title: function() {
                        return 'About';
                    }
                },
                public: true
            }).state('contact', {
                name: 'contact',
                url: '/contact',
                templateUrl: 'contact.html',
                resolve: {
                    $title: function() {
                        return 'Contact';
                    }
                },
                public: true
            }).state({
                name: 'profile',
                url: '/profile',
                controller: 'profile',
                templateUrl: 'profile.html',
                resolve: {
                    $title: function() {
                        return 'My Profile';
                    }
                }
            });

            $titleProvider.documentTitle(function($rootScope) {
                var title = 'GigKeeper';
                if ($rootScope.$title) {
                    title = $rootScope.$title + ' - ' + title;
                }
                return title;
            });
        }
    ]);

}());