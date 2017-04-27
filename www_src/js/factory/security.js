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

angular.module('GigKeeper').factory('Security', [
    '$resource', 'UrlBuilder',
    function($resource, UrlBuilder) {
        return {
            data: $resource(UrlBuilder.build('/api/v1/security'), {}, {
                login: {
                    action: 'login',
                    method: 'POST',
                    url: UrlBuilder.build('/api/v1/login')
                },
                logout: {
                    action: 'logout',
                    method: 'POST',
                    url: UrlBuilder.build('/api/v1/logout')
                },
                profile: {
                    action: 'profile',
                    method: 'GET',
                    url: UrlBuilder.build('/api/v1/user/profile')
                },
                requestPasswordReset: {
                    action: 'requestPasswordReset',
                    method: 'POST',
                    url: UrlBuilder.build('/api/v1/requestPasswordReset')
                },
                resetPassword: {
                    action: 'resetPassword',
                    method: 'POST',
                    url: UrlBuilder.build('/api/v1/resetPassword')
                }
            })
        };
    }
]);
