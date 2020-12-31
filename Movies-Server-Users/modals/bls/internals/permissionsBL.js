const permissionsDal = require('../../../dals/permissionsDal');

exports.getAllPermissions = async function () {
    return await permissionsDal.readPermissionsFromFile();
}

exports.getPermissionById = async function (id) {
    let permissionsData = await permissionsDal.readPermissionsFromFile();
    let permissions = permissionsData.permissions;
    if (permissions.length > 0) {
        return permissions.filter(permission => permission.id == id)[0];
    }
}

exports.addPermission = async function (permissionObj) {
    let permissionsData = await permissionsDal.readPermissionsFromFile();
    let permissions = permissionsData.permissions;
    if (permissionObj) {
        permissionObj.id = await this.getNextMaxPermissionId();
        permissions.push({ ...permissionObj });
        permissionsData = { ...permissionsData, permissions: permissions };
        await permissionsDal.writePermissionsToFile(permissionsData);
        return permissionObj.id;
    }
}

exports.updatePermission = async function (id, permissionObj) {
    let permissionsData = await permissionsDal.readPermissionsFromFile();
    let permissions = permissionsData.permissions;
    if (permissions.length > 0 && permissionObj) {
        let index = permissions.findIndex(permission => permission.id == id);
        if (index > -1) {
            permissionObj.id = id;
            permissions[index] = permissionObj;
            permissionsData = { ...permissionsData, permissions: permissions };
            await permissionsDal.writePermissionsToFile(permissionsData);
        }
    }
}

exports.deleteUser = async function (id) {
    let permissionsData = await permissionsDal.readPermissionsFromFile();
    let permissions = permissionsData.permissions;
    if (permissions.length > 0 && id) {
        let index = permissions.findIndex(user => user.id == id);
        if (index > -1) {
            permissions.splice(index, 1);
            permissionsData = { ...permissionsData, permissions: permissions };
            await permissionsDal.writePermissionsToFile(permissionsData);
        }
    }
}

exports.getNextMaxPermissionId = async () => {
    let permissionsData = await permissionsDal.readPermissionsFromFile();
    let permissions = permissionsData.permissions;
    if (permissions.length > 0) {
        let maxPermissionId = permissions.map(permission => permission.id).sort((a, b) => a - b)[
            permissions.length - 1
        ]
        if (maxPermissionId == undefined) {
            return 1;
        }
        return maxPermissionId + 1;
    } else {
        return 1;
    }
}
