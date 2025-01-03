const express = require('express');
const router = express.Router()
const userController = require('../controller/controller.user')

router.post('/addUser' , userController.userController.addUser)

router.post('/VerifyUser' , userController.userController.userVerified)

router.post('/fetchUser' , userController.userController.fetchUser)

router.post('/login' , userController.userController.UserLogging)

router.post('/sulogin' , userController.userController.suLogging)

router.post('/AdminUser' , userController.userController.AdminAddUser)

router.post('/resend' , userController.userController.Resendotp)

router.post('/changePassword' , userController.userController.changePassword)

router.get('/getAdmin', userController.userController.fetchAdmin)

router.post(`/editUser/:userID`, userController.userController.editUser)

router.delete(`/deleteUser/:userID`, userController.userController.deleteUser)

router.post(`/toggle/:userID`, userController.userController.toggle)


module.exports = router