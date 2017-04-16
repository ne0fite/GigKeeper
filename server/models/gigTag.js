"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("gig_tag", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, primaryKey: true, allowNull: false },
        gigId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, allowNull: false },
        tagId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV1, allowNull: false }
    }, {
        classMethods: {
            associate: function(models) {
                models.gig_tag.belongsTo(models.profile, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
};