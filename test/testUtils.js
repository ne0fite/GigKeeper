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

var server = require("../main.js"); // our index.js from above
var Promise = require("bluebird");

module.exports = {

    login: function (user, password) {
        var options = {
            method: "POST",
            url: "/api/v1/login",
            payload: {
                email: user,
                password: password
            }
        };

        return this.sendRequest(options).then(function(response) {
            if (response.statusCode == 200) {
                var cookie = response.headers["set-cookie"][0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
                return cookie[0];
            } else {
                throw new Error(response.payload);
            }
        });
    },

    /**
     * Promise wrapper to the server inject method.
     * @param {Object} options
     * @returns {Promise}
     */
    sendRequest: function (options) {
        return new Promise(function (resolve) {
            server.inject(options, function (response) {
                resolve(response);
            });
        });
    }
};