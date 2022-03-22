const { DataTypes } = require('sequelize')

const timestamps = {
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ...timestamps
        })
        await queryInterface.createTable('blogs', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            author: {
                type: DataTypes.STRING
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            likes: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            ...timestamps
        })
        await queryInterface.addColumn('blogs', 'user_id', {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('blogs')
        await queryInterface.dropTable('users')
    }
}
