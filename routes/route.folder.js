const express = require('express');
const router = express.Router()
const folderController = require('../controller/controller.folder')

router.get('/folder-structure', folderController.folderController.fetchfolder);

router.get('/fetchParent', folderController.folderController.fetchParentfolder);

router.post('/childfolder', folderController.folderController.getChild);

router.get('/fetchAdminAndCheckAccess/:id' , folderController.folderController.fetchAdminAndCheckAccess)

router.post('/saveFolderPermissions' , folderController.folderController.assignPermission)

router.post('/folder' , folderController.folderController.getUserFolder)

router.post('/getFolderContents' , folderController.folderController.getFolderContents)


module.exports = router

