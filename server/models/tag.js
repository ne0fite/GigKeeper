"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("tag", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true }
    }, {
        classMethods: {
            associate: function(models) {
                models.tag.belongsTo(models.profile, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
};