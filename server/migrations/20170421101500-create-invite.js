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
        return queryInterface.createTable(
            "invites", {
                id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true, allowNull: false },
                email: { type: Sequelize.STRING, allowNull: false, unique: "unq_email_code" },
                code: { type: Sequelize.STRING, allowNull: false, unique: "unq_email_code" },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            }
        ).then(function() {
            return queryInterface.addIndex(
                "invites", ["email", "code"], {
                    indexName: "unq_email_code",
                    indicesType: "UNIQUE"
                });
        }).then(function() {
            return queryInterface.addIndex(
                "invites", ["code"], {
                    indexName: "unq_code",
                    indicesType: "UNIQUE"
                });
        });
    },
    down: function(queryInterface, Sequelize) { // eslint-disable-line
        return queryInterface.dropTable("invites");
    }
};