const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {
    toJSON() {
        const obj = { ...this.get() }
        delete obj.passwordHash
        return obj
    }
}

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
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user'
})

module.exports = User