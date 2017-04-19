"use strict";

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            "profiles",
            "defaultDuration", {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        );
    },

    down: function(queryInterface, Sequelize) { // eslint-disable-line
        return queryInterface.removeColumn("profiles", "defaultDuration");
    }
};