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
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn("gigs", "originPlace", {
            type: Sequelize.JSONB(),
            allowNull: true
        }).then(function() {
            return queryInterface.addColumn("gigs", "originType", { 
                type: Sequelize.ENUM("home", "gig", "other"), 
                allowNull: false, 
                defaultValue: "home" 
            });
        }).then(function() {
            return queryInterface.addColumn("gigs", "originGigId", { 
                type: Sequelize.UUID, 
                allowNull: true,
                references: {
                    model: "gigs",
                    key: "id"
                }
            });
        }).then(function() {
            return queryInterface.changeColumn("gigs", "contractorId", {
                type: Sequelize.UUID, 
                allowNull: true
            });
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn("gigs", "originPlace")
        .then(function() {
            return queryInterface.removeColumn("gigs", "originType");
        })
        .then(function() {
            return queryInterface.removeColumn("gigs", "originGigId");
        }).then(function() {
            return queryInterface.changeColumn("gigs", "contractorId", {
                type: Sequelize.UUID, 
                allowNull: false
            });
        });
    }
};
