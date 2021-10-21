const express = require("express")
const router = express.Router()
const { createUser, loginUser, updateProfile, deleteUser, uploadFiles, getFiles, deleteFiles } = require('../controllers/user')
const auth = require('../middleware/auth')
    // Login/Register
router.post('/register', createUser)
router.post('/login', loginUser)
    // CRUD Methods
router.patch('/profile/edit', auth, updateProfile)
router.delete('/profile/delete', auth, deleteUser)
    // S3 Actions
router.post('/uploadFiles', auth, uploadFiles)
router.get('/getFiles', auth, getFiles)
router.delete('/deleteFiles', auth, deleteFiles)
module.exports = router