const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
    defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash'] }
    },
    scopes: {
        login: {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
    }
})

module.exports = User