const express = require('express');
const router = express.Router()
const folderController = require('../controller/controller.folder')
const checkTokenMiddleware = require('../middleware/middlware.checkToken')

router.get('/folder-structure', checkTokenMiddleware, folderController.folderController.fetchfolder);

router.get('/subfolder' , checkTokenMiddleware ,folderController.folderController.fetchsubParentfolder);

router.get('/fetchParent', checkTokenMiddleware ,folderController.folderController.fetchParentfolder);

router.post('/childfolder', checkTokenMiddleware, folderController.folderController.getChild);

router.get('/fetchAdminAndCheckAccess/:id' , checkTokenMiddleware, folderController.folderController.fetchAdminAndCheckAccess)

router.post('/saveFolderPermissions' , checkTokenMiddleware ,folderController.folderController.assignPermission)

router.post('/folder' , checkTokenMiddleware, folderController.folderController.getUserFolder)

router.post('/getFolderContents' , checkTokenMiddleware, folderController.folderController.getFolderContents)

router.post('/createFolder' , checkTokenMiddleware, folderController.folderController.createFolder)

router.post('/createchildFolder' , checkTokenMiddleware, folderController.folderController.createchildFolder)

router.post('/getThumbnailbyDate' , checkTokenMiddleware, folderController.folderController.getThumbnailByDate)


module.exports = router

