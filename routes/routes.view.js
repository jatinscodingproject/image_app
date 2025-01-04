const express = require('express');
const path = require('path');
const router = express.Router()

router.get('/',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/login.html'))
})

router.get('/su',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/superadmin.html'))
})

router.get('/createAccount',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/register.html'))
})

router.get('/forgetPassword',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/forgot-password.html'))
})

router.get('/home',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/index.html'))
})

router.get('/user',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/user.html'))
})

router.get('/permission',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/permisssion.html'))
})

router.get('/set-Permission/:parentname',(req,res) => {
    const parentname = req.params.parentname;
    res.sendFile(path.join(__dirname , '../view/setpermission.html'), {parentname})
})

router.get('/addUser',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/addUser.html'))
})

router.get('/Createfolder',(req,res) => {
    res.sendFile(path.join(__dirname , '../view/createFolder.html'))
})

module.exports = router
