const usersRouter = require('express').Router()
const { userFinder } = require('../util/middleware')
const { User, Blog } = require('../models')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (_req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'passwordHash'] },
        include: {
            model: Blog,
            as: 'readings',
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
            through: {
                as: 'readinglists',
                attributes: ['id', 'state'],
                where: req.query.state
                    ? { state: req.query.state }
                    : {}
            }
        }
    })

    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

usersRouter.post('/', async (req, res) => {
    const saltRounds = 10
    req.body.passwordHash = await bcrypt.hash(req.body.password, saltRounds)
    delete req.body.password
    const user = await User.create(req.body)
    res.json(user)
})

usersRouter.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    if (user) {
        delete req.body.id
        for ([key, value] of Object.entries(req.body)) {
            if (user[key] !== undefined) {
                user[key] = value
            }
        }
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

usersRouter.delete('/:id', userFinder, async (req, res) => {
    const user = req.foundObj
    if (user) {
        await user.destroy()
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

module.exports = usersRouter