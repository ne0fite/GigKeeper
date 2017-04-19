"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("user", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        active: { type: DataTypes.BOOLEAN, allNull: false, defaultValue: false },
        scope: { type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function(models) {
                models.user.belongsTo(models.profile, {
                    foreignKey: {
                        field: "profileId",
                        allowNull: false
                    }
                });
            }
        }
    });
};