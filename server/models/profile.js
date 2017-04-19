"use strict";

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
                    delete val.opening_hours;
                    delete val.photos;
                    delete val.reviews;
                }
                this.setDataValue("homeBasePlace", JSON.stringify(val));
            }
        },
        defaultDuration: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        classMethods: {

        }
    });
};