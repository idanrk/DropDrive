const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { JWT_TOKEN } = require('../../config/config')
const redis = require('../db/redis')
const auth = async(req, res, next) => {
    try {
        const bearer = req.headers.authorization
        const token = bearer.split('Bearer ')[1]
        const decoded_id = await jwt.verify(token, JWT_TOKEN)["id"]
        const tokens = await redis.hgetallAsync(`users<${decoded_id}>`)
        if (!Object.values(tokens).includes(token)) { // If token not in redis the re-auth
            throw new Error()
        }
        const info = await User.findUserById(decoded_id)
        const user = new User(info)
        req.user = user
        req.token = token
        next()
    } catch (error) {
        if (error) {
            return res.status(401).send({ "error": "Please authenticate" })
        }
    }
}
module.exports = auth