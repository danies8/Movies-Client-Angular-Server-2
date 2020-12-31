const axios = require('axios');

const common = require('../../../Utils/common');

exports.getAllUsers = async function () {

  try {
    let usersList = [];

    let respPermissions = await axios.get(common.permissionsAddress);
    let respPermissionsData = respPermissions.data;
    if (respPermissionsData.isSuccess) {
      let permissionsList = respPermissionsData.results.permissions;

      let respUsers = await axios.get(common.usersAddress);
      let respUserssData = respUsers.data;
      if (respUserssData.isSuccess) {
        let users = respUserssData.results.users;
        let filtredUsers = users.filter(user => user.loginId !== "5fa1afd916ec5d3c78758846")
        if (filtredUsers.length > 0) {
          permissionsList.forEach((permissions, index) => {
            filtredUsers.forEach((filtredUser, index) => {
              let userData = {};
              if (filtredUser.id === permissions.userId) {
                userData["userData"] = filtredUser;
                userData["permissions"] = permissions.permissions;
                userData["userName"] = permissions.userName;
                usersList.push(userData);
              }
            });
          });
        }
      }
      else {
        return { isSuccess: false, errorMessage: "Error in getting users data" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Error in getting permissions data" };
    }
    return { isSuccess: true, results: usersList };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message }
  }
}


exports.addUser = async function (addUserObj) {
  try {
    console.log(addUserObj);
    let respLoginUsers = await axios.post(common.loginUsersAddress, { userName: addUserObj.results.userName, password: "1qaz1qaz" });
    let respLoginUsersData = respLoginUsers.data;
    if (respLoginUsersData.isSuccess) {

      let respUsers = await axios.post(common.usersAddress,
        {
          firstName: addUserObj.results.userData.firstName,
          lastName: addUserObj.results.userData.lastName,
          createdDate: addUserObj.results.userData.createdDate,
          sessionTimeout: addUserObj.results.userData.sessionTimeout,
          loginId: respLoginUsersData.id
        });
      let respUsersData = respUsers.data;
      if (respUsersData.isSuccess) {
        let respPermissions = await axios.post(common.permissionsAddress,
          {
            userId: respUsersData.id,
            userName: addUserObj.results.userName,
            permissions: addUserObj.results.permissions
          });
        let respPermissionsData = respPermissions.data;
        if (!respPermissionsData.isSuccess) {
          return { isSuccess: false, errorMessage: "Failed to add user's permissions'" };
        }
      }
      else {
        return { isSuccess: false, errorMessage: "Failed to add user" };
      }

    }
    else {
      return { isSuccess: false, errorMessage: "Failed to add login user info" };
    }
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

exports.isUserNameExists = async function (userName) {
  try {

    let respLoginUsers = await axios.get(common.loginUsersAddress);
    let respLoginUsersData = respLoginUsers.data;
    if (respLoginUsersData.isSuccess) {
      let filteredLoginUsersData = respLoginUsersData.results.filter(login => login.userName == userName);
      if (filteredLoginUsersData.length > 0) {
        return { isSuccess: true };
      }
      else {
        return { isSuccess: false, errorMessage: "" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to brings login's users" };
    }
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.deleteUser = async function (userId) {
  try {
    let respUsers = await axios.get(common.usersAddress + "/" + userId);
    let respUsersData = respUsers.data;
    if (respUsersData.isSuccess) {
      await axios.delete(common.loginUsersAddress + "/" + respUsersData.results.loginId);
      let respUsers = await axios.delete(common.usersAddress + "/" + userId);
      let respUserssData = respUsers.data;
      if (respUserssData.isSuccess) {
        let respPermissions = await axios.get(common.permissionsAddress);
        let respPermissionsData = respPermissions.data;
        if (respPermissionsData.isSuccess) {
          let filteredRespPermissionsData = respPermissionsData.results.permissions.filter(permission => permission.userId == userId);
          if (filteredRespPermissionsData.length > 0) {
            let permissoinId = filteredRespPermissionsData[0].id;
            let respPermission = await axios.delete(common.permissionsAddress + "/" + permissoinId);

          }
        }
      }
      else {
        return { isSuccess: false, errorMessage: "Error in getting users data" };

      }
    }
    else {
      return { isSuccess: false, errorMessage: "Error in getting users data" };

    }
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

exports.getUserById = async function (userId) {
  try {
    let user = {};
    let respUsers = await axios.get(common.usersAddress + "/" + userId);
    let respUsersData = respUsers.data;
    if (respUsersData.isSuccess) {
      let usersData = respUsersData.results;

      let respPermissions = await axios.get(common.permissionsAddress);
      let respPermissionsData = respPermissions.data;
      if (respPermissionsData.isSuccess) {
        let permissionsList = respPermissionsData.results.permissions;

        permissionsList.forEach((permissions, index) => {
          if (usersData.id === permissions.userId) {
            user["userData"] = usersData;
            user["permissions"] = permissions.permissions;
            user["userName"] = permissions.userName;
          }
        });
      }
      else {
        return { isSuccess: false, errorMessage: "Error in getting permissions data" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Error in getting permissions data" };
    }

    return { isSuccess: true, user: user };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }

}


exports.updateUser = async function (userId, editUser) {
  try {

    console.log(editUser);
    let respLoginUsers = await axios.get(common.loginUsersAddress);
    let respLoginUsersData = respLoginUsers.data;
    if (respLoginUsersData.isSuccess) {
      let filteredRespLoginUsersData = respLoginUsersData.results.filter(login => login.userName === editUser.results.userName);
      if (filteredRespLoginUsersData.length > 0) {

        let respUsers = await axios.put(common.usersAddress + "/" + userId,
          {
            firstName: editUser.results.userData.firstName,
            lastName: editUser.results.userData.lastName,
            createdDate: editUser.results.userData.createdDate,
            sessionTimeout: editUser.results.userData.sessionTimeout,
            loginId: filteredRespLoginUsersData[0]._id
          });
        let respUsersData = respUsers.data;
        if (respUsersData.isSuccess) {

          let respPermissions = await axios.get(common.permissionsAddress);
          let respPermissionsData = respPermissions.data;
          if (respPermissionsData.isSuccess) {
            let filteredRespPermissionsData = respPermissionsData.results.permissions.filter(permission => permission.userId == editUser.results.userData.id);
            if (filteredRespPermissionsData.length > 0) {
              let permissoinId = filteredRespPermissionsData[0].id;
              let respPutPermission = await axios.put(common.permissionsAddress + "/" + permissoinId,
                {
                  userId: userId,
                  userName: editUser.results.userName,
                  permissions: editUser.results.permissions
                });
              let respPutPermissionData = respPutPermission.data;
              if (!respPutPermissionData.isSuccess) {
                return { isSuccess: false, errorMessage: "Failed to update user's permissions" };
              }
            }
            else {
              return { isSuccess: false, errorMessage: "Failed to find permissions for the edited user" };
            }
          }
        }
        else {
          return { isSuccess: false, errorMessage: "Failed to update user" };
        }
      }
      else {
        return { isSuccess: false, errorMessage: "User name or password doesn't exists" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Error in getting users data" };
    }
    return { isSuccess: true };
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }

}


exports.getUserSessionTimeout = async function (logInObj) {
  try {

    let respLoginUsers = await axios.get(common.loginUsersAddress);
    let respLoginUsersData = respLoginUsers.data;
    if (respLoginUsersData.isSuccess) {
      let filteredLoginUsersData = respLoginUsersData.results.filter(login => login.userName == logInObj.userName &&
        login.password == logInObj.password);
      if (filteredLoginUsersData.length > 0) {
        const logInUid = filteredLoginUsersData[0]._id;

        let respUsers = await axios.get(common.usersAddress);
        let respUsersData = respUsers.data;
        if (respUsersData.isSuccess) {
          let filteredRespUsersData = respUsersData.results.users.filter(user => user.loginId === logInUid);
          if (filteredRespUsersData.length > 0) {
            return { isSuccess: true, sessionTimeout: parseInt(filteredRespUsersData[0].sessionTimeout) * 60 };
          }
        }
        else {
          return { isSuccess: false, errorMessage: "Failed to bring users data" };
        }

      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring logins data" };
    }

 }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }

}