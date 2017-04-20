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

var place = require("../lib/place")();

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("profile", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        homeBasePlace: { 
            type: DataTypes.TEXT, 
            allowNull: true,
            get: function() {
                return JSON.parse(this.getDataValue("homeBasePlace"));
            },
            set: function(val) {
                if (val) {
                    place.set(val);
                }
                this.setDataValue("homeBasePlace", place.toString());
            }
        },
        defaultDuration: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        classMethods: {
            
        }
    });
};