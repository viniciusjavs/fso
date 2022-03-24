const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {
    toJSON() {
        const obj = { ...this.get() }
        const date = new Date(obj.year)
        obj.year = date.getFullYear()
        return obj
    }
}

const nextYear = () => {
    const date = new Date()
    const year = date.getFullYear() + 1
    return `${year}-01-01`
}

Blog.init(
{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    year: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isAfter: '1990-12-31',
            isBefore: nextYear()
        }
    }
},
{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
    defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
})

module.exports = Blog
