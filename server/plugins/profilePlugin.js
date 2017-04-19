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