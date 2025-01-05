const User = require('../model/model.user');
const UserType = require('../model/model.userType');
const Page = require('../model/model.page');
const PageAccess = require('../model/model.pageaccess');
const FolderPermission = require('../model/model.folderPermission');
const Folder = require('../model/model.folder');
const subFolder = require('../model/model.subflder')
const ftpuser = require('../model/model.ftpuser')

subFolder.hasMany(FolderPermission, { foreignKey: 'subfolderId' });
FolderPermission.belongsTo(subFolder, { foreignKey: 'subfolderId' });

module.exports = {
    User,
    UserType,
    Page,
    PageAccess,
    FolderPermission,
    Folder,
    subFolder,
    ftpuser,
};
