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

"use strict";

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn("invites", "message", {
            type: Sequelize.TEXT, 
            allowNull: true
        }).then(function() {
            return queryInterface.addColumn("invites", "userId", {
                type: Sequelize.UUID, 
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                }
            });
        }).then(function() {
            return queryInterface.addColumn("invites", "registeredAt", {
                type: Sequelize.DATE, 
                allowNull: true
            });
        }).then(function() {
            return queryInterface.addColumn("invites", "profileId", {
                type: Sequelize.UUID, 
                allowNull: true,
                references: {
                    model: "profiles",
                    key: "id"
                }
            });
        });
    },
    down: function(queryInterface, Sequelize) { // eslint-disable-line no-unused-vars
        return queryInterface.removeColumn("invites", "profileId")
        .then(function() {
            return queryInterface.removeColumn("invites", "registeredAt");
        })
        .then(function() {
            return queryInterface.removeColumn("invites", "userId");
        })
        .then(function() {
            return queryInterface.removeColumn("invites", "message");
        });
    }
};