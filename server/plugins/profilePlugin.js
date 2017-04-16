var Boom = require("boom");
var Joi = require("Joi");

var profilePlugin = {

    register: function(server, options, next) {
        next();
    }
};

profilePlugin.register.attributes = {
    name: "profilePlugin",
    version: "0.0.1"
};

module.exports = profilePlugin;