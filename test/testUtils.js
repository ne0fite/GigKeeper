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