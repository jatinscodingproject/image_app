const services = require('../services/index');
const { fetchAdminAndCheckAccess, assignPermission, getFolderContents } = require('../services/services.folder');
const { Resendotp, changePassword } = require('../services/services.user');
const {HttpStatus} = require('../utils/utils.httpStatus')

const folderController = {
    async fetchfolder(req,res){
        const response = await services.folderServices.getfolderstructure(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async fetchParentfolder(req,res){
        const response = await services.folderServices.fetchParentfolder(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async fetchsubParentfolder(req,res){
        const response = await services.folderServices.getchildfolderstructure(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async getChild(req,res){
        const response = await services.folderServices.getchild(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async fetchAdminAndCheckAccess(req,res){
        const response = await services.folderServices.fetchAdminAndCheckAccess(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async assignPermission(req,res){
        const response = await services.folderServices.assignPermission(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async getUserFolder(req,res){
        const response = await services.folderServices.getUserFolders(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async getFolderContents(req,res){
        const response = await services.folderServices.getFolderContents(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async createFolder(req,res){
        const response = await services.folderServices.createFolder(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async createchildFolder(req,res){
        const response = await services.folderServices.createchildFolder(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async getThumbnailByDate(req,res){
        const response = await services.folderServices.getThumbnailByCode(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async searchFolders(req,res){
        const response = await services.folderServices.searchFolders(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    }
}

module.exports = {
    folderController
} 