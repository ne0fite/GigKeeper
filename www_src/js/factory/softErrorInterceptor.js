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

angular.module('GigKeeper').factory('SoftErrorInterceptor', [
    '$q', 'Alerts',
    function($q, Alerts) {
        return {
            response: function(response) {
                return response;
            },

            responseError: function(response) {
                if(response.status == 401) {
                    return response;        //it is redundant to display a message for a 401
                }

                var message;
                if (response.data) {
                    if (response.data.message) {
                        message = response.data.message;
                    } else {
                        message = response.data;
                    }
                } else {
                    message = response;
                }

                Alerts.add(message, Alerts.constants.error);

                return $q.reject(response);
            }
        };
    }
]);