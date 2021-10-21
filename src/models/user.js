const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sql = require('../db/mysql')
const redis = require('../db/redis')
const { JWT_TOKEN } = require('../../config/config')

class User {
    constructor({ user_id, username, email, password, firstname, lastname }) {
        this.username = username
        this.email = email
        this.password = password
        this.firstname = firstname
        this.lastname = lastname
        this.user_id = user_id
    }
    toString() {
        return {
            "user_id": this.user_id,
            "email": this.email,
            "username": this.username,
            "firstname": this.firstname,
            "lastname": this.lastname,
        }
    }
    static async init({ username, password, email, firstname, lastname }) {
        return new Promise((resolve, reject) => {
            sql.query("INSERT INTO users(username, password, email, firstname, lastname) VALUES (?,?,?,?,?);", [username, password, email, firstname, lastname], (err, results) => {
                if (err) {
                    if (err['sqlMessage'].includes('email')) {
                        return reject(new Error("Email is already in use!"))
                    } else if (err['sqlMessage'].includes('username')) {
                        return reject(new Error("Username is already in use!"))
                    } else {
                        return reject(new Error(err))
                    }
                } else {
                    return resolve(results["insertId"])
                }
            })
        })
    }
    deleteUser() {
        return new Promise(async(resolve, reject) => {
            try {
                await redis.expireAsync(`users<${this.user_id}>`, 0)
            } catch (error) {
                console.log(error)
                return reject({ "error": "something went wrong.." })
            }
            sql.query("DELETE FROM users WHERE user_id = ?;", [this.user_id],
                (err, results) => {
                    if (err) {
                        return reject({ err })
                    } else {
                        return resolve(results)
                    }
                })
        })
    }
    updateUser() {
        return new Promise((resolve, reject) => {
            sql.query("UPDATE users SET username = ?, password = ?, email = ?, firstname = ?, lastname = ? WHERE user_id = ?;", [this.username, this.password, this.email, this.firstname, this.lastname, this.user_id],
                (err, results) => {
                    if (err) {
                        if (err['sqlMessage'].includes('email')) {
                            return reject({ error: "Email is already in use!" })
                        } else if (err['sqlMessage'].includes('username')) {
                            return reject({ error: "Username is already in use!" })
                        } else {
                            return reject({ error })
                        }
                    } else {
                        return resolve(results["insertId"])
                    }
                })
        })
    }
    async genAuthToken() {
        async function pushToken(pk, token) {
            await redis.hmsetAsync(`users<${id}>`, pk, token)
            await redis.expireAsync(`users<${id}>`, exprireTime)
        }
        const id = this.user_id.toString()
        const days = 2
        const exprireTime = days * 3600
        const token = await jwt.sign({ id }, JWT_TOKEN, { expiresIn: '2days' })
        if (token === undefined) {
            return new Error("Unable to generate token")
        }
        const exists = await redis.existsAsync(`users<${id}>`)
        if (!exists) {
            await pushToken(1, token)
        } else {
            const tokens = await redis.hgetallAsync(`users<${id}>`)
            const nextPk = Object.keys(tokens).length + 1
            await pushToken(nextPk, token)
        }
        return token
    }
    static async findUserById(id) {
        return new Promise((resolve, reject) => {
            sql.query("SELECT * FROM users WHERE user_id = ?", [id], (err, rows) => {
                if (err) {
                    return reject(err)
                }
                const user = rows[0]
                return resolve(user)
            })
        })
    }
    static async findUserByCredentials({ username, password }) {
        return new Promise(async(resolve, reject) => {
            sql.query("SELECT * FROM users WHERE username = ?", [username], async(err, rows, fields) => {
                if (err) {
                    return reject(err)
                }
                if (rows.length < 1) {
                    return reject("The username or password are not correct")
                }
                const user = rows[0]
                const valid = await bcrypt.compare(password, user.password)
                if (!valid) {
                    console.log('h')
                    return reject(new Error("The username or password are not correct"))
                }
                delete user["password"]
                return resolve(user)
            })
        })
    }
}
module.exports = User