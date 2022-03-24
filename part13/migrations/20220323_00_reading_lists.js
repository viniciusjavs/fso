const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('reading_lists', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            },
            blog_id: {
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
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('reading_lists')
    }
}
