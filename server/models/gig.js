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

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("gig", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        startPlace: {  type: DataTypes.JSONB, allowNull: true },
        place: {  type: DataTypes.JSONB, allowNull: true },
        distance: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
        duration: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
        startDate: { type: DataTypes.DATE, allowNull: false },
        endDate: { type: DataTypes.DATE, allowNull: false },
        notes: { type: DataTypes.TEXT, allowNull: true }
    }, {
        classMethods: {
            associate: function(models) {
                models.gig.belongsTo(models.profile, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                models.gig.belongsTo(models.contractor, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                models.gig.belongsToMany(models.tag, {
                    through: {
                        model: models.gig_tag,
                        unique: false
                    },
                    foreignKey: "gigId"
                });
            }
        }
    });
};