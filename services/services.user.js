require('dotenv').config()
const { HttpStatus } = require('../utils/utils.httpStatus');
const model = require('../model/index');
const { CustomError } = require('../utils/utils.error');
const sequelize = require('../config/db');
const { generateSecretTokenUser } = require('../middleware/middleware.jwt')
const { hashedValue } = require('../utils/utils.generathashPassword')
const { userVerification } = require('../utils/utils.userVerification');
const { where } = require('sequelize');

const userServices = {
    async addUser(req, res) {
        const t = await sequelize.transaction()
        try {
            const { FName, LName, email , password, username , AccountTypeID } = req.body;
            const checking_user_email = await model.User.findOne({
                where: {
                    email: email,
                }
            }, { transaction: t });
            const checking_user = await model.User.findOne({
                where: {
                    Username: username,
                }
            }, { transaction: t });
            let message;
            if (checking_user_email) {
                return {msg:"Email Already Exists" , result:"fail"}
            }else if(checking_user){
                return {msg:"Username Already Exists" , result:"fail"}
            } else {
                message = "User added";
                hashedPasswords = await hashedValue.generatehashPass(password)
                const newUser = await model.User.create({
                    FName: FName,
                    Username: username,
                    LName: LName,
                    email: email,
                    password: hashedPasswords,
                    isVerified: false,
                    isActive: false,
                    isConfirmed: false,
                    AccountTypeID: AccountTypeID
                }, { transaction: t });
                const user = newUser.get({ plain: true });
                userVerification.sendEmailOTP(email)
            }
            await t.commit()
            return { msg: 'User Added and Verification otp sent' , result:"pass" }
        } catch (err) {
            if (t) await t.rollback();
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async userVerified(req, res) {
        const { otp, email } = req.body;
        const t = await sequelize.transaction();
    
        try {
            const user = await model.User.findOne({
                where: {
                    generatedEmailOtp: otp,
                    email: email,
                },
                transaction: t,
            });
    
            if (!user) {
                await t.rollback();
                return {msg:'Invalid Otp' , result:"fail"};
            }
    
            const plainUser = user.get({ plain: true });

            await model.User.update(
                {
                    generatedEmailOtp: null,
                    isVerified: true,
                    isActive:true,
                },
                {
                    where: { email: email },
                    transaction: t,
                }
            );

    
            await t.commit();
            return {msg:"Your Account Confirmed" , result:"pass"}
        } catch (error) {
            if (t) await t.rollback();
            return {msg:"Wrong Otp Kindly Enter Again" , result:"fail"}
        }
    },
    

    async getUser(req, res) {
        let t;
        try {
            const { username } = req.body;
            t = await sequelize.transaction();
    
            const user = await model.User.findOne({ where: { Username: username } });
            if (!user) {
                await t.rollback();
                return { msg: 'User not found', result:"fail" };
            }
    
            let Users;
            if (user.AccountTypeID === 2) {
                Users = await model.User.findAll({ where: { createdBy: username } });
            } else if (user.AccountTypeID === 1) {
                Users = await model.User.findAll();
            } else {
                await t.rollback();
                return { msg: 'Invalid AccountTypeID' , result:"fail"}
            }

    
            await t.commit();
            return { msg: 'Users fetched successfully', Users , result:"pass"};
        } catch (err) {
            if (t) await t.rollback();
            return { msg: "something went wrong" , result:"fail" }
        }
    },

    async getAdmin(req,res){
        let t;
        try{
            t = await sequelize.transaction();
    
            const Admin = await model.User.findOne({ where: { AccountTypeID : 2 } });
            await t.commit();
            return { msg: 'Users fetched successfully', Admin , result:"pass"};

        }catch(err){
            if (t) await t.rollback();
            return { msg: "something went wrong" , result:"fail" }
        }
    },

    async userLogging(req, res) {
        const { username, password } = req.body;
        try {
            const user = await model.User.findOne({ where: { Username: username } });
            if (!user) {
                return {msg:"User Does not Exists", result:"fail"}
            }

            const isPasswordMatch = await hashedValue.comparehashPass(password, user.password)
            if (!isPasswordMatch) {
                return {msg:"Password is Wrong" , result:"fail"}
            }
            if (user.AccountTypeID === 1){
                return {msg:"Account not found",  result:'fail'}
            }

            if(user.isPasswordChange === true){
                 return {msg:"First Time Logging Kindly Change Password" , result : "true" , activity : 'changePassword'}
            }

            if(user.isActive === false){
                return {msg:"Your Account is not active" , result:"fail"}
            }

            const token = generateSecretTokenUser(user.UserId)
            
            const pages = await model.PageAccess.findAll({
                where:{
                    AccountTypeID:user.AccountTypeID,
                    hasAcess:true
                }   
            })
            return {msg:'Logging Successfully', token , result:"pass", pages , 'username' : user.Username , 'type' : user.AccountTypeID}
        } catch (err) {
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async SuLogging(req, res) {
        const { username, password } = req.body;
        try {
            const user = await model.User.findOne({ where: { Username: username } });
            if (!user) {
                return {msg:"User Does not Exists", result:"fail"}
            }
            const isPasswordMatch = await hashedValue.comparehashPass(password, user.password)
            if (!isPasswordMatch) {
                return {msg:"Password is Wrong" , result:"fail"}
            }
            if (user.AccountTypeID === 2 || user.AccountTypeID === 3){
                return {msg:"Account not found",  result:'fail'}
            }
            const token = generateSecretTokenUser(user.UserId)
            
            const pages = await model.PageAccess.findAll({
                where:{
                    AccountTypeID:user.AccountTypeID,
                    hasAcess:true
                }   
            })
            return {msg:'Logging Successfully', token , result:"pass", pages , 'username' : user.Username , 'type' : user.AccountTypeID}
        } catch (err) {
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async AdminaddUser(req, res) {
        const t = await sequelize.transaction()
        try {
            // console.log(req.body)
            const { FName, LName, username , AccountTypeID, createdBy } = req.body;

            const password = process.env.User_creation_password
            const checking_user = await model.User.findOne({
                where: {
                    Username: username,
                }
            }, { transaction: t });
            let message;
            if(checking_user){
                return {msg:"Username Already Exists" , result:"fail"}
            } else {
                // console.log(111111)
                message = "Admin added User";
                // console.log(222222222222222)
                hashedPasswords = await hashedValue.generatehashPass(password)
                // console.log(3333333333333)
                const newUser = await model.User.create({
                    FName: FName,
                    Username: username,
                    LName: LName,
                    email: "blank",
                    password: hashedPasswords,
                    isVerified: true,
                    isActive: true,
                    isConfirmed: false,
                    isPasswordChange : true,
                    AccountTypeID: AccountTypeID,
                    createdBy:createdBy
                }, { transaction: t });
                // console.log(4444444444444444444)
                const user = newUser.get({ plain: true });
            }
            // console.log('done')
            await t.commit()
            return { msg: 'New User Added' , result:"pass" }
        } catch (err) {
            if (t) await t.rollback();
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async Resendotp(req, res) {
        try {
            const { email } = req.body;
            userVerification.sendEmailOTP(email)
            return { msg: 'New Otp has been send' , result:"pass" }
        } catch (err) {
            return {msg:"Something Went Wrong" , result:"fail"}
        }
    },

    async changePassword(req, res) {
        const { username , oldPassword, newPassword } = req.body;
        try {
            const user = await model.User.findOne({ where: { Username: username } });;
    
            if (!user) {
                return {msg:"User Does not Exists", result:"fail"}
            }
    
            const isOldPasswordMatch = await hashedValue.comparehashPass(oldPassword, user.password);
            if (!isOldPasswordMatch) {
                return {msg:"Please Enter Correct Old Password" , result:"fail"};
            }
    
            const hashedPassword = await hashedValue.generatehashPass(newPassword);
    
            user.password = hashedPassword;
            user.isPasswordChange = false;
            await user.save();
    
            return { msg: "Password changed successfully", result: "pass" };
        } catch (err) {
            return { msg: "Something went wrong", result: "fail" };
        }
    },

    async editUser(req, res) {
        const t = await sequelize.transaction();
        try {
            const userId = req.params.userID;
            // console.log(userId);
            const { Username, FName, LName } = req.body;
            // console.log(req.body);
    
            const [updatedRows] = await model.User.update(
                { Username, FName, LName },
                {
                    where: { UserId: userId },
                    transaction: t
                }
            );
    
            if (updatedRows === 0) {
                await t.rollback();
                return { msg: "User Not Found", result: "fail" }
            }
    
            await t.commit();
    
            return { msg: "User Info Updated", result: "pass" };
        } catch (error) {
            if (t) await t.rollback();
            // console.error(error);
            return { msg: "Something Went Wrong", result: "fail" };
        }
    },

    async deleteUser(req, res) {
        const t = await sequelize.transaction();
        try {
            const userId = req.params.userID;
            // console.log(req.params)
    
            if (!userId) {
                return res.status(400).json({ msg: "User ID is required", result: "fail" });
            }
    
            const deletedRows = await model.User.destroy({
                where: { UserId: userId },
                transaction: t
            });
    
            if (deletedRows === 0) {
                await t.rollback();
                return { msg: "User Not Found", result: "fail" }
            }
    
            await t.commit();
    
            return { msg: "User Deleted Successfully", result: "pass" }
    
        } catch (error) {
            if (t) await t.rollback();
            return res.status(500).json({ msg: "Something Went Wrong", result: "fail" });
        }
    },

    async toggle(req, res) {
        const t = await sequelize.transaction();
        try {
            const userId = req.params.userID;
            // console.log(userId);
            
            const { status } = req.body;
            let value;
    
            if (status === "active") {
                value = true;
            } else if (status === "inactive") {
                value = false;
            } else {
                return { msg: "Invalid status", result: "fail" }
            }
    
            const [updatedRows] = await model.User.update(
                { isActive: value }, 
                {
                    where: { UserId: userId },
                    transaction: t
                }
            );
    
            if (updatedRows === 0) {
                await t.rollback();
                return { msg: "User Not Found", result: "fail" };
            }
    
            await t.commit();
            return { msg: "User Info Updated", result: "pass" };
        } catch (error) {
            if (t) await t.rollback();
            return { msg: "Something Went Wrong", result: "fail" };
        }
    }
    

}

module.exports = userServices
