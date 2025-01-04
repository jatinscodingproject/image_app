require('dotenv').config();
const fs = require('fs');
const path = require('path');
const model = require('../model/index');
const sequelize = require('../config/db');

const BASE_DIRECTORY = path.resolve('./serverAssets');

function getAllParentFolders(baseDir) {
    // console.log(baseDir)
    return fs.readdirSync(baseDir).filter((item) => {
        try {
            const fullPath = path.join(baseDir, item);
            // console.log(fullPath)
            return fs.statSync(fullPath).isDirectory(); // Accept any directory name
        } catch (error) {
            console.warn(`Error accessing ${item}: ${error.message}`);
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
        .filter(dirent => dirent.isDirectory()) // Accept any folder name
        .map(dirent => ({
            name: dirent.name,
            path: path.join(directoryPath, dirent.name),
            type: 'folder',
            children: getFolderHierarchy(path.join(directoryPath, dirent.name)), // Recursive fetch
        }));

    return results;
}

const getFolderContents = (folderPath) => {
    // Check if the folder exists
    if (fs.existsSync(folderPath)) {
        const contents = fs.readdirSync(folderPath);

        // Return the contents of the folder as an array
        return contents.map(item => {
            const fullPath = path.join(folderPath, item);
            return {
                name: item,
                path: fullPath,
                type: fs.statSync(fullPath).isDirectory() ? 'folder' : 'file',
                children: fs.statSync(fullPath).isDirectory() ? [] : null // If it's a folder, check for its children
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
    // console.log(filesAndFolders)
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
            console.error(error);
    
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
            console.error(error)
            return { error: 'An error occurred while fetching folder structure', result: "fail" };
        }
    },


    async fetchParentfolder(req, res) {
        // const t = sequelize.transaction()
        try {
            const existingParentFolders = await model.Folder.findAll({
                attributes: ['parentname', 'path']
            });
            // await t.commit()
            console.log(existingParentFolders)
            return { msg: "parent name fetched", result: "pass", existingParentFolders }
        } catch (error) {
            // if(t) await t.rollback()
            console.log(error)
            return { error: 'An error occurred while fetching or comparing parent folder names from the database', result: "fail" };
        }
    },

    async getchild(req, res) {
        try {
            const { parentname } = req.body
            const childfolder = await model.subFolder.findAll({
                attributes: ['name', 'path', 'parentname', 'id'],
                where: { parentname: parentname }
            })

            return { msg: "child folder fetched successfully", result: "pass", childfolder }
        } catch {
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
                where: { folderId: id }
            });

            // console.log("fff", folderPermissions)


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

                const folder = await model.Folder.findOne({ where: { id: folderId } });

                if (!folder) {
                    return { result: 'fail', message: 'Folder not found' }
                }

                const permission = await model.FolderPermission.findOne({
                    where: { Username: username, folderId: folder.id }
                });

                if (permission) {
                    permission.hasAccess = hasAccess;
                    await permission.save();
                } else {
                    await model.FolderPermission.create({
                        Username: username,
                        parentname: folder.parentname,
                        foldername: folder.name,
                        folderpath: folder.path,
                        hasAccess: hasAccess,
                        folderId: folder.id
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
            // Find the user based on their username
            const user = await model.User.findOne({
                where: { Username: username }
            });

            if (!user) {
                return { msg: "User not found", result: "fail" };
            }

            // For Superadmin (AccountTypeID 1), return all folder structure
            if (user.AccountTypeID === 1) {
                const folderStructure = getFolderHierarchy(BASE_DIRECTORY);
                return { msg: "Folder structure for superadmin", result: "pass", folderStructure };
            }

            // For Admin (AccountTypeID 2), filter based on `hasAccess: true`
            if (user.AccountTypeID === 2) {
                const folderPermissions = await model.FolderPermission.findAll({
                    where: { Username: user.Username, hasAccess: true },
                    attributes: ['folderpath', 'hasAccess']
                });

                // console.log(folderPermissions);

                if (folderPermissions.length === 0) {
                    return { msg: "No folder access found for this admin", result: "nofound" };
                }

                const folderPathsWithAccess = folderPermissions.map(permission => permission.folderpath);

                // console.log("fff", folderPathsWithAccess);

                // Replace 'F:\' with '../../' and '\\' with '/'
                const updatedFolderPaths = folderPathsWithAccess.map(folderPath =>
                    folderPath.replace('F:\\', '../../').replace(/\\/g, '/')
                );

                // console.log("Updated folder paths:", updatedFolderPaths);

                const absoluteFolderPaths = updatedFolderPaths.map(folderPath =>
                    path.resolve(BASE_DIRECTORY, folderPath)
                );

                // console.log("Absolute folder paths:", absoluteFolderPaths);

                const folderStructure = absoluteFolderPaths.map(folderPath => getFolderHierarchy(folderPath));

                // console.log('Folder structure:', folderStructure);

                return { msg: "Folders for admin with access", result: "pass", folderStructure };


            }

            if (user.AccountTypeID === 3) {
                const folderPermissions = await model.FolderPermission.findAll({
                    where: { Username: user.createdBy, hasAccess: true },
                    attributes: ['folderpath']
                });

                if (folderPermissions.length === 0) {
                    return { msg: "No folder access found for regular user", result: "fail" }
                }

                const folderPathsWithAccess = folderPermissions.map(permission => permission.folderpath);

                const folderStructure = folderPathsWithAccess.map(folderPath => getFolderHierarchy(folderPath));

                return { msg: "Folders for regular user", result: "pass", folderStructure }
            }

            return { msg: "Invalid user role", result: "fail" };
        } catch (error) {
            console.error(error);
            return { msg: "Something went wrong", result: "fail" }
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
        const { folderName , username } = req.body;
        console.log(req.body)

        const foldercreation = createFolders(BASE_DIRECTORY , folderName)
    }
};

module.exports = folderServices;
