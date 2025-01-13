require('dotenv').config();
const fs = require('fs');
const path = require('path');
const model = require('../model/index');
const sequelize = require('../config/db');
const { dir } = require('console');
const { Sequelize } = require('sequelize');

const BASE_DIRECTORY = path.resolve('./serverAssets');

function getAllParentFolders(baseDir) {
    return fs.readdirSync(baseDir).filter((item) => {
        try {
            const fullPath = path.join(baseDir, item);
            return fs.statSync(fullPath).isDirectory();
        } catch (error) {
            return false;
        }
    });
}


function getFolderHierarchy(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory not found: ${directoryPath}`);
    }

    const items = fs.readdirSync(directoryPath, { withFileTypes: true });

    const results = items
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({
            name: dirent.name,
            path: path.join(directoryPath, dirent.name),
            type: 'folder',
            children: getFolderHierarchy(path.join(directoryPath, dirent.name)),
        }));

    return results;
}

const getFolderContents = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        const contents = fs.readdirSync(folderPath);

        return contents.map(item => {
            const fullPath = path.join(folderPath, item);
            return {
                name: item,
                path: fullPath,
                type: fs.statSync(fullPath).isDirectory() ? 'folder' : 'file',
                children: fs.statSync(fullPath).isDirectory() ? [] : null
            };
        });
    }
    return [];
};

function createFolders(baseDirectory, folderName) {
    if (!folderName) {
        throw new Error('Folder name is required.');
    }

    const targetDirectory = path.join(baseDirectory, folderName);

    try {
        if (fs.existsSync(targetDirectory)) {
            return `Folder already exists: ${targetDirectory}`;
        }

        fs.mkdirSync(targetDirectory, { recursive: true });
        return `Folder created successfully: ${targetDirectory}`;
    } catch (error) {
        throw new Error(`Error creating folder: ${error.message}`);
    }
}


async function getSubfolders(directoryPath) {
    const filesAndFolders = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    return filesAndFolders
        .filter((item) => item.isDirectory())
        .map((folder) => folder.name);
}

const folderServices = {
    async getfolderstructure(req, res) {
        const t = await sequelize.transaction();
        try {
            const parentFolders = getAllParentFolders(BASE_DIRECTORY);
    
            const folderStructures = await Promise.all(
                parentFolders.map(async (parentFolder) => {
                    const parentFolderPath = path.join(BASE_DIRECTORY, parentFolder);
    
                    const existingFolder = await model.Folder.findOne({
                        where: { path: parentFolderPath },
                    });
    
                    if (existingFolder) {
                        return {
                            folderName: parentFolder,
                            folderId: existingFolder.id,
                        };
                    }

                    const Folder = await model.Folder.create({
                        name: parentFolder,
                        path: parentFolderPath,
                        parentname: parentFolder,
                    });
    
                    return {
                        folderName: parentFolder,
                        folderId: Folder.id,
                    };
                })
            );
            await t.commit();
    
            return { msg: "Parent folders added in DB", result: "pass", folderStructures };
        } catch (error) {
            if (t) await t.rollback();
            return { error: 'An error occurred while fetching folder structure', result: "fail" };
        }
    },

    async getchildfolderstructure(req, res) {
        const t = await sequelize.transaction()
        try {
            const parentFolders = getAllParentFolders(BASE_DIRECTORY);
            const folderStructures = await Promise.all(
                parentFolders.map(async (parentFolder) => {
                    const parentFolderPath = path.join(BASE_DIRECTORY, parentFolder);

                    const level1Folders = await getSubfolders(parentFolderPath);

                    const folderData = await Promise.all(
                        level1Folders.map(async (subFolder) => {
                            const subFolderPath = path.join(parentFolderPath, subFolder);

                            const existingFolder = await model.subFolder.findOne({
                                where: { path: subFolderPath },
                            });

                            if (existingFolder) {
                                return {
                                    folderName: subFolder,
                                    folderId: existingFolder.id,
                                };
                            }

                            const Folder = await model.subFolder.create({
                                name: subFolder,
                                path: subFolderPath,
                                parentname: parentFolder,
                            });

                            return {
                                folderName: subFolder,
                                folderId: Folder.id,
                            };
                        })
                    );

                    return {
                        parentFolderName: parentFolder,
                        level1Folders: folderData,
                    };
                })
            );
            await t.commit()
            return { msg: "Folder added in DB", result: "pass", folderStructures }
        } catch (error) {
            if (t) await t.rollback();
            return { error: 'An error occurred while fetching folder structure', result: "fail" };
        }
    },


    async fetchParentfolder(req, res) {
        try {
            const existingParentFolders = await model.Folder.findAll({
                attributes: ['parentname', 'path']
            });
            
            return { msg: "parent name fetched", result: "pass", existingParentFolders }
        } catch (error) {
            return { error: 'An error occurred while fetching or comparing parent folder names from the database', result: "fail" };
        }
    },

    async getchild(req, res) {
        try {
            const { parentname } = req.body
            const childfolder = await model.subFolder.findAll({
                attributes: ['name', 'path', 'parentname', 'id'],
                where: { parentname: parentname },
            });

        
    
            if (!childfolder.length) {
                return { msg: "No child folders found", result: "fail" };
            }

            return { msg: "child folder fetched successfully", result: "pass", childfolder }
        } catch(error) {
            return { msg: "something went worng", result: "fail" }

        }
    },

    async fetchAdminAndCheckAccess(req, res) {
        const { id } = req.params;
        try {
            const admins = await model.User.findAll({
                where: { AccountTypeID: 2 }
            })

            const folderPermissions = await model.FolderPermission.findAll({
                where: { subfolderId: id }
            });

            const permissionMap = folderPermissions.reduce((map, permission) => {
                map[permission.Username] = permission.hasAccess;
                return map;
            }, {});

            const adminData = await Promise.all(
                admins.map(async admin => {
                    const hasAccess = permissionMap[admin.Username] === true;

                    return {
                        FullName: `${admin.FName} ${admin.LName}`,
                        Username: admin.Username,
                        hasAccess: hasAccess,
                    };
                })
            );


            return { admins: adminData }
        } catch (error) {
            return { msg: "Something Went Wrong", result: "fail" }
        }
    },

    async assignPermission(req, res) {
        const { updates } = req.body;

        try {
            for (const update of updates) {
                const { username, folderName, hasAccess } = update;
                const folderId = parseInt(folderName);
                const folder = await model.subFolder.findOne({ where: { id: folderId } });
                if (!folder) {
                    return { result: 'fail', message: 'Folder not found' }
                }
                const permission = await model.FolderPermission.findOne({
                    where: { Username: username, subfolderId: folder.id }
                });

                if (permission) {
                    permission.hasAccess = hasAccess;
                    await permission.save();
                } else {
                    const permission = await model.FolderPermission.create({
                        Username: username,
                        parentname: folder.parentname,
                        foldername: folder.name,
                        folderpath: folder.path,
                        hasAccess: hasAccess,
                        subfolderId: folder.id
                    });
                }
            }

            return { msg: "Permission set successfully", result: 'success' }

        } catch (error) {
            return { result: 'fail', message: 'Something Went Wrong' }
        }
    },

    async getUserFolders(req, res) {
        const { username } = req.body;
    
        try {
            const user = await model.User.findOne({
                where: { Username: username }
            });
    
            if (!user) {
                return { msg: "User not found", result: "fail" }
            }
    
            if (user.AccountTypeID === 1) {
                const folderStructure = getFolderHierarchy(BASE_DIRECTORY);
                return { msg: "Folder structure for superadmin", result: "pass", folderStructure };
            }
    
            if (user.AccountTypeID === 2) {
                const folderPermissions = await model.FolderPermission.findAll({
                    where: { Username: user.Username, hasAccess: true },
                    attributes: ['folderpath', 'hasAccess', 'foldername']
                });
    
    
                if (folderPermissions.length === 0) {
                    return { msg: "No folder access found for this admin", result: "fail" };
                }
    
                const folderPathsWithAccess = folderPermissions.map(permission => permission.folderpath);
    
                const updatedFolderPaths = folderPathsWithAccess.map(folderPath =>
                    folderPath.replace(/\\/g, '/').replace('F:', '..')
                );
    
    
                try {
                    const folderStructure = updatedFolderPaths.map(folderPath => getFolderHierarchy(path.resolve(folderPath)));
                    return { msg: "Folders for admin with access", result: "pass", folderStructure };
                } catch (error) {
                    return { msg: 'Error retrieving folder structure', result: 'error', error: error.message };
                }
            }
    
            if (user.AccountTypeID === 3) {
                const folderPermissions = await model.FolderPermission.findAll({
                    where: { Username: user.createdBy, hasAccess: true },
                    attributes: ['folderpath']
                });
    
                if (folderPermissions.length === 0) {
                    return { msg: "No folder access found for this admin", result: "fail" };
                }
    
                const folderPathsWithAccess = folderPermissions.map(permission => permission.folderpath);
    
                const updatedFolderPaths = folderPathsWithAccess.map(folderPath =>
                    folderPath.replace(/\\/g, '/').replace('F:', '..')
                );
    
                try {
                    const folderStructure = updatedFolderPaths.map(folderPath => getFolderHierarchy(path.resolve(folderPath)));
                    return { msg: "Folders for admin with access", result: "pass", folderStructure };
                } catch (error) {
                    return { msg: 'Error retrieving folder structure', result: 'error', error: error.message };
                }
            }
    
            return res.json({ msg: "Invalid user role", result: "fail" });
        } catch (error) {
            return res.json({ msg: "Something went wrong", result: "fail", error: error.message });
        }
    },
    

    async getFolderContents(req, res) {
        const { folderPath } = req.body;

        const contents = getFolderContents(folderPath);

        if (contents.length > 0) {
            res.json({
                result: 'pass',
                folderContents: contents
            });
        } else {
            res.json({
                result: 'fail',
                msg: 'No contents found'
            });
        }
    },

    async createFolder(req, res) {
        try{
            const { folderName , username } = req.body;
            const foldercreation = createFolders(BASE_DIRECTORY , folderName)

            return {msg : `${folderName} created successfully` , result:"pass" , foldercreation}
        }catch(err){
            return {msg : "Folder cant be created" , result:"fail"}
        }
        
    },

    async createchildFolder(req, res) {
        const { folderName, ftpuser, parentname } = req.body;
    
        try {
            const childFolderPath = `${BASE_DIRECTORY}/${parentname}`;
    
            const folderCreated = createFolders(childFolderPath , folderName)
            if (!folderCreated) {
                return res.status(500).json({ success: false, message: 'Failed to create folder on the server.' });
            }
    
            const savedData = await model.ftpuser.create({
                foldername: folderName,
                ftpuser: ftpuser,
                parentname: parentname,
            });
    
            return {msg : `${folderName} created successfully` , result:"pass" , folderCreated}
        } catch (error) {
            return {
                message: 'An error occurred while creating the child folder.', result:"fail"
            }
        }
    }
    
};

module.exports = folderServices;
