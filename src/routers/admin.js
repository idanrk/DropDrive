const express = require("express")
const router = express.Router()
    // Admin user login
router.post('/login', loginAdmin)
    // CRUD on other users
router.get('/getUser', auth, getUser)
router.post('/createUser', auth, createUser)
router.patch('/updateUser', auth, updateUser)
router.delete('/deleteUser', auth, deleteUser)