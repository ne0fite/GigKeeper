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