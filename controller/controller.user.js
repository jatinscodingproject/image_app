const services = require('../services/index');
const { Resendotp, changePassword } = require('../services/services.user');
const {HttpStatus} = require('../utils/utils.httpStatus')

const userController = {
    async addUser(req,res){
        const response = await services.userServices.addUser(req ,res);
        return res.status(HttpStatus.CREATED).json(response);
    },
    async userVerified(req,res){
        const response = await services.userServices.userVerified(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async fetchUser(req,res){
        const response = await services.userServices.getUser(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async UserLogging(req,res){
        const response = await services.userServices.userLogging(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async AdminAddUser(req,res){
        const response = await services.userServices.AdminaddUser(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async Resendotp(req,res){
        const response = await services.userServices.Resendotp(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async suLogging(req,res){
        const response = await services.userServices.SuLogging(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async changePassword(req,res){
        const response = await services.userServices.changePassword(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async fetchAdmin(req,res){
        const response = await services.userServices.getAdmin(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async editUser(req,res){
        const response = await services.userServices.editUser(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async deleteUser(req,res){
        const response = await services.userServices.deleteUser(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async toggle(req,res){
        const response = await services.userServices.toggle(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async logout(req,res){
        const response = await services.userServices.userLogout(req,res);
        return res.status(HttpStatus.OK).json(response);
    },
    async changePassword(req,res){
        console.log(99999999)
        const response = await services.userServices.changePassword(req,res);
        return res.status(HttpStatus.OK).json(response);
    }
    
}

module.exports = {
    userController
}