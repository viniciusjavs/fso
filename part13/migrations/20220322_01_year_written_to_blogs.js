const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year', {
            type: DataTypes.DATEONLY
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('blogs', 'year')
    }
}
