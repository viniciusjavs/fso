const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ReadingLists extends Model {}

ReadingLists.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'blogs', key: 'id' }
    },
    state: {
        type: DataTypes.ENUM,
        values: ['unread', 'read'],
        defaultValue: 'unread',
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_lists'
})

module.exports = ReadingLists