const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('sessions', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('sessions')
    }
}