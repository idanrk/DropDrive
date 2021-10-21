const User = require('../models/user')
const bcrypt = require('bcryptjs')
const validate = require('../../utils/validate')

exports.createUser = async(req, res) => {
    try { // Checking avaliablity with DB
        const status = validate(req.body)
        if (Object.keys(status).length > 0) {
            throw new Error(JSON.stringify(status))
        }
        req.body["password"] = await bcrypt.hash(req.body["password"], 8)
        const user_id = await User.init(req.body) // If successfuly inserted to DB the create a User instance
        const user = new User({ user_id, ...req.body })
        const token = await user.genAuthToken()
        req.user = user
        res.status(201).send({ "user": user.toString(), token })
    } catch (error) {
        return res.status(400).send(error.message)
    }

}
exports.loginUser = async(req, res) => {
    try {
        const info = await User.findUserByCredentials(req.body)
        const user = new User(info)
        const token = await user.genAuthToken()
        req.user = user
        req.token = token
        res.send({ "user": user.toString(), token })
    } catch (error) {
        return res.status(400).send(error.message)
    }
}
exports.updateProfile = async(req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error("No updates provided."))
        }
        const status = validate(req.body)
        console.log(status)
        if (Object.keys(status).length > 0) {
            throw new Error(JSON.stringify(status))
        }
        const updates = Object.keys(req.body)
        const allowedUpdates = ["email", "username", "password", "firstname", "lastname"] // other than that will raise an error 400.
        const valid = updates.every((update) => allowedUpdates.includes(update))
        if (!valid)
            return res.status(400).send(`Update request denied: Invalid update arguments.
             Allowed arguments: ${allowedUpdates}`)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.updateUser()
        res.send(req.user.toString())
    } catch (error) {
        return res.status(400).send(error.message)
    }
}
exports.deleteUser = async(req, res) => {
    try {
        await req.user.deleteUser()
        res.send("Success")
    } catch (error) {
        return res.status(400).send(error)
    }
}
exports.uploadFiles = async(req, res) => {}
exports.getFiles = async(req, res) => {}
exports.deleteFiles = async(req, res) => {}