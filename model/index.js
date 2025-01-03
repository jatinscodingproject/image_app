const User = require('../model/model.user');
const UserType = require('../model/model.userType');
const Page = require('../model/model.page');
const PageAccess = require('../model/model.pageaccess');
const FolderPermission = require('../model/model.folderPermission');
const Folder = require('../model/model.folder');

Folder.hasMany(FolderPermission, { foreignKey: 'folderId' });
FolderPermission.belongsTo(Folder, { foreignKey: 'folderId' });

module.exports = {
    User,
    UserType,
    Page,
    PageAccess,
    FolderPermission,
    Folder,
};
