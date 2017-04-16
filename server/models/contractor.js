"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("contractor", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        address1: { type: DataTypes.STRING, allowNull: true },
        address2: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        region: { type: DataTypes.STRING, allowNull: true },
        postalCode: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: true },
        web: { type: DataTypes.STRING, allowNull: true }
    }, {
        classMethods: {
            associate: function(models) {
                models.contractor.belongsTo(models.profile, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
};