"use strict";

var place = require("../models/place")();

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("gig", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        place: { 
            type: DataTypes.TEXT, 
            allowNull: true,
            get: function() {
                return JSON.parse(this.getDataValue("place"));
            },
            set: function(val) {
                if (val) {
                    place.set(val);
                }
                this.setDataValue("place", place.toString());
            }
        },
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