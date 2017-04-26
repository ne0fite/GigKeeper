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

angular.module('GigKeeper').filter('secondsToElapsedTime', [
    function() {
        return function(seconds) {
            var minuteSeconds = 60;
            var hourSeconds = minuteSeconds * 60;
            var daySeconds = hourSeconds * 24;
            var weekSeconds = daySeconds * 7;

            var weeks = Math.floor(seconds / weekSeconds);
            seconds -= weeks * weekSeconds;
            var days = Math.floor(seconds / daySeconds);
            seconds -= days * daySeconds;
            var hours = Math.floor(seconds / hourSeconds);
            seconds -= hours * hourSeconds;
            var minutes = Math.floor(seconds / minuteSeconds);
            seconds -= minutes * minuteSeconds;

            return {
                weeks: weeks,
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        };
    }
]);