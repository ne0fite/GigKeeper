"use strict";

module.exports = {
    up: function(queryInterface, Sequelize) { // eslint-disable-line no-unused-vars
        return queryInterface.addIndex(
            "users", ["email"], {
                indexName: "unq_email",
                indicesType: "UNIQUE"
            }
        );
    },

    down: function(queryInterface, Sequelize) { // eslint-disable-line no-unused-vars
        return queryInterface.removeIndex("users", "unq_email");
    }
};