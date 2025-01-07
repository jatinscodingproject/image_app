const express = require('express');
const router = express.Router()
const userController = require('../controller/controller.user')
const checkTokenMiddleware = require('../middleware/middlware.checkToken')

router.post('/addUser' , checkTokenMiddleware,  userController.userController.addUser)

router.post('/VerifyUser' , userController.userController.userVerified)

router.post('/fetchUser' , checkTokenMiddleware, userController.userController.fetchUser)

router.post('/login' , userController.userController.UserLogging)

router.post('/sulogin' , userController.userController.suLogging)

router.post('/AdminUser' , checkTokenMiddleware , userController.userController.AdminAddUser)

router.post('/resend' , userController.userController.Resendotp)

router.post('/changePassword' , userController.userController.changePassword)

router.get('/getAdmin', userController.userController.fetchAdmin)

router.post(`/editUser/:userID`, checkTokenMiddleware, userController.userController.editUser)

router.delete(`/deleteUser/:userID`, checkTokenMiddleware ,userController.userController.deleteUser)

router.post(`/toggle/:userID`, checkTokenMiddleware, userController.userController.toggle)


module.exports = router