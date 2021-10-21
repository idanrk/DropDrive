const express = require('express')
const app = express()
const userRoutes = require('./routers/user')
    //const adminRoutes = require('./routers/admin')
app.use(express.json())
app.use('/user', userRoutes)
    //app.use('/admin', adminRoutes)
app.use((req, res, next) => {
    res.status(404).send({ "error": "Error 404 Page Not Found" })
})

module.exports = app