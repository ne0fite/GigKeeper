/**
 * @license
 * Copyright (C) 2017 Phoenix Bright Software, LLC
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

angular.module('GigKeeper').config([
    '$compileProvider', '$stateProvider', '$urlRouterProvider', '$titleProvider', '$httpProvider', 'localStorageServiceProvider', 'ConfigProvider',
    function($compileProvider, $stateProvider, $urlRouterProvider, $titleProvider, $httpProvider, localStorageServiceProvider, ConfigProvider) {

        //
        // Compiler Setup
        //
        if (ConfigProvider.env != 'development') {
            $compileProvider.debugInfoEnabled(false);
        }
        $compileProvider.commentDirectivesEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        
        //
        // Route Setup
        //
        $urlRouterProvider.otherwise('/');

        localStorageServiceProvider
            .setPrefix('GigKeeper')
            .setStorageType('sessionStorage');

        $stateProvider.state({
            name: 'home',
            url: '/',
            controller: 'HomeController as vm',
            templateUrl: '/template/views/home.html',
            public: true,
            resolve: {
                $title: function() {
                    return 'Home';
                }
            }
        }).state({
            public: true,
            name: 'terms',
            url: '/terms',
            templateUrl: '/template/views/terms.html'
        }).state({
            public: true,
            name: 'privacyPolicy',
            url: '/privacy-policy',
            templateUrl: '/template/views/privacyPolicy.html'
        }).state({
            public: true,
            name: 'forgotPassword',
            url: '/forgot-password',
            controller: 'ForgotPasswordController as vm',
            templateUrl: '/template/views/forgotPassword.html',
            resolve: {
                $title: function() {
                    return 'Forgot Password';
                }
            }
        }).state({
            public: true,
            name: 'forgotPasswordWithEmail',
            url: '/forgot-password/{email}',
            controller: 'ForgotPasswordController as vm',
            templateUrl: '/template/views/forgotPassword.html',
            resolve: {
                $title: function() {
                    return 'Forgot Password';
                }
            }
        }).state({
            public: true,
            name: 'resetPassword',
            url: '/reset-password/{token}',
            controller: 'ResetPasswordController as vm',
            templateUrl: '/template/views/resetPassword.html',
            resolve: {
                $title: function() {
                    return 'Reset Password';
                }
            }
        }).state({
            public: true,
            name: 'register-invite',
            url: '/register/invite/:code',
            controller: 'RegisterInviteController as vm',
            templateUrl: '/template/views/registerInvite.html',
            resolve: {
                invite: [
                    '$stateParams',
                    'Registration',
                    function($stateParams, Registration) {
                        return Registration.data.invite({ code: $stateParams.code }).$promise;
                    }
                ],
                $title: function() {
                    return 'Register';
                }
            }
        }).state({
            name: 'send-invite',
            url: '/profile/invite',
            controller: 'SendInviteController as vm',
            templateUrl: '/template/views/sendInvite.html',
            resolve: {
                $title: function() {
                    return 'Send Invite';
                }
            }
        }).state({
            name: 'gigs',
            url: '/gigs',
            controller: 'GigController as vm',
            templateUrl: '/template/views/gigs.html',
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
            name: 'addGig',
            url: '/gigs/add',
            controller: 'GigEditController as vm',
            templateUrl: '/template/views/gigEdit.html',
            resolve: {
                gig: [
                    function() {
                        return {};
                    }
                ],
                contractors: [
                    'Contractor',
                    function(Contractor) {
                        return Contractor.data.index().$promise;
                    }
                ],
                $title: function() {
                    return 'Add Gig';
                }
            }
        }).state({
            name: 'editGig',
            url: '/gigs/{id}',
            controller: 'GigEditController as vm',
            templateUrl: '/template/views/gigEdit.html',
            resolve: {
                gig: [
                    '$stateParams', 'Gig', 'BlockingPromiseManager',
                    function($stateParams, Gig, BlockingPromiseManager) {
                        var request = Gig.data.read({ id: $stateParams.id }).$promise;
                        BlockingPromiseManager.add(request);
                        return request;
                    }
                ],
                contractors: [
                    'Contractor',
                    function(Contractor) {
                        return Contractor.data.index().$promise;
                    }
                ],
                $title: function() {
                    return 'Edit Gig';
                }
            }
        }).state({
            name: 'contractors',
            url: '/contractors',
            controller: 'ContractorController as vm',
            templateUrl: '/template/views/contractors.html',
            resolve: {
                $title: function() {
                    return 'My Contractors';
                }
            }
        }).state({
            name: 'tags',
            url: '/tags',
            controller: 'TagController as vm',
            templateUrl: '/template/views/tags.html',
            resolve: {
                $title: function() {
                    return 'My Tags';
                }
            }
        }).state({
            name: 'settings',
            url: '/settings',
            controller: 'SettingsController as vm',
            templateUrl: '/template/views/settings.html',
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
            controller: 'ProfileController as vm',
            templateUrl: '/template/views/profile.html',
            resolve: {
                profile: [
                    'Profile', 
                    function(Profile) {
                        return Profile.data.index().$promise;
                    }
                ],
                $title: function() {
                    return 'My Profile';
                }
            }
        });

        //
        // Page Title Setup
        //
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

        //
        // Interceptors
        //
        $httpProvider.interceptors.push('AuthenticationInterceptor');
        $httpProvider.interceptors.push('SoftErrorInterceptor');
    }
]);