const axios = require('axios');

const common = require('../../../Utils/common');

exports.createLoginUser = async function (logInCreateObj) {

  try {
    let respLoginUsers = await axios.get(common.loginUsersAddress);
    let respLoginUsersData = respLoginUsers.data;
    if (respLoginUsersData.isSuccess) {
      let filteredLoginUsersData = respLoginUsersData.results.filter(login => login.userName == logInCreateObj.userName);
      if (filteredLoginUsersData.length > 0) {
        const logInUid = filteredLoginUsersData[0]._id;
        let respUpdateLoginUsers = await axios.put(common.loginUsersAddress + "/" + logInUid, logInCreateObj);
        let respUpdateLoginUsersData = respUpdateLoginUsers.data;
        if (respUpdateLoginUsersData.isSuccess) {
          return { isSuccess: true };
        }
        else {
          return { isSuccess: false, errorMessage: "Failed to update new login password" };
        }
      }
      else {
        return { isSuccess: false, errorMessage: "User name doesn't exists" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Error in getting logins data" };
    }
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.getUserInfo = async function (logInObj) {
  try {

    let respLoginUsers = await axios.get(common.loginUsersAddress);
    let respLoginUsersData = respLoginUsers.data;
    if (respLoginUsersData.isSuccess) {
      let filteredLoginUsersData = respLoginUsersData.results.filter(login => login.userName == logInObj.userName &&
        login.password == logInObj.password);
      if (filteredLoginUsersData.length > 0) {
        const logInUid = filteredLoginUsersData[0]._id;


        let isUserAdminResults = isUserAdmin(logInObj.userName, logInObj.password);
        if (isUserAdminResults) {

          return { isUserExist: true, userId: logInUid, isUserAdmin: true, userName: logInObj.userName };
        }
        else {

          let respPermissions = await axios.get(common.permissionsAddress);
          let respPermissionsData = respPermissions.data;
          if (respPermissionsData.isSuccess) {
            let permissions = respPermissionsData.results.permissions;
            let filteredPermissionsData = permissions.filter(permissoin => permissoin.userName == logInObj.userName);
            if (filteredPermissionsData.length > 0) {
              let permissoinId = filteredPermissionsData[0].id;

              permissions = filteredPermissionsData[0].permissions;
              let hasPermissionForSubscriptions = isUserHasPermissionForSubscriptions(permissions);
              let hasPermissionForCreateSubscriptions = isUserHasPermissionForCreateSubscriptions(permissions);
              let hasPermissionForEditSubscriptions = isUserHasPermissionForEditSubscriptions(permissions);
              let hasPermissionForDeleteSubscriptions = isUserHasPermissionForDeleteSubscriptions(permissions);

              let hasPermissionForMovies = isUserHasPermissionForMovies(permissions);
              let hasPermissionForCreateMovies = isUserHasPermissionForCreateMovies(permissions);
              let hasPermissionForEditMovies = isUserHasPermissionForEditMovies(permissions);
              let hasPermissionForDeleteMovies = isUserHasPermissionForDeleteMovies(permissions);
              return {
                isUserExist: true, userId: logInUid, isUserAdmin: false,
                hasPermissionForSubscriptions: hasPermissionForSubscriptions,
                hasPermissionForCreateSubscriptions: hasPermissionForCreateSubscriptions,
                hasPermissionForEditSubscriptions: hasPermissionForEditSubscriptions,
                hasPermissionForDeleteSubscriptions: hasPermissionForDeleteSubscriptions,
                hasPermissionForMovies: hasPermissionForMovies,
                hasPermissionForCreateMovies: hasPermissionForCreateMovies,
                hasPermissionForEditMovies: hasPermissionForEditMovies,
                hasPermissionForDeleteMovies: hasPermissionForDeleteMovies,
                userName: logInObj.userName
              };
            }
          }
        }
      }
      else {
        return { isUserExist: false, errorMessage: "User name or password doesn't exists" };
      }
    }
    else {
      return { isUserExist: false, errorMessage: "Error in getting logins data" };
    }
  }
  catch (e) {
    return { isUserExist: false, errorMessage: e.message };
  }
}

const isUserAdmin = (userName, password) => {
  if (userName == "admin@yahoo.com" && password == "ytghjuyt") {
    return true;
  }
  else {
    return false;
  }
}


const isUserHasPermissionForSubscriptions = (permissions) => {
  let isUserHasPermissionForSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("View Subscriptions") ||
      permission.includes("Create Subscriptions") ||
      permission.includes("Delete Subscriptions") ||
      permission.includes("Update Subscriptions"))
      isUserHasPermissionForSubscriptions = true;
  });
  return isUserHasPermissionForSubscriptions;
}

const isUserHasPermissionForCreateSubscriptions = (permissions) => {
  let isUserHasPermissionForCreateSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Create Subscriptions"))
      isUserHasPermissionForCreateSubscriptions = true;
  });
  return isUserHasPermissionForCreateSubscriptions;
}

const isUserHasPermissionForEditSubscriptions = (permissions) => {
  let isUserHasPermissionForEditSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Update Subscriptions"))
      isUserHasPermissionForEditSubscriptions = true;
  });
  return isUserHasPermissionForEditSubscriptions;
}

const isUserHasPermissionForDeleteSubscriptions = (permissions) => {
  let isUserHasPermissionForDeleteSubscriptions = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Delete Subscriptions"))
      isUserHasPermissionForDeleteSubscriptions = true;
  });
  return isUserHasPermissionForDeleteSubscriptions;
}

const isUserHasPermissionForMovies = (permissions) => {
  let isUserHasPermissionForMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("View Movies") ||
      permission.includes("Create Movies") ||
      permission.includes("Update Movies") ||
      permission.includes("Delete Movies"))
      isUserHasPermissionForMovies = true;
  });
  return isUserHasPermissionForMovies;
}

const isUserHasPermissionForCreateMovies = (permissions) => {
  let isUserHasPermissionForCreateMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Create Movies"))
      isUserHasPermissionForCreateMovies = true;
  });
  return isUserHasPermissionForCreateMovies;
}

const isUserHasPermissionForEditMovies = (permissions) => {
  let isUserHasPermissionForEditMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Update Movies"))
      isUserHasPermissionForEditMovies = true;
  });
  return isUserHasPermissionForEditMovies;
}

const isUserHasPermissionForDeleteMovies = (permissions) => {
  let isUserHasPermissionForDeleteMovies = false;
  permissions.forEach((permission, index) => {
    if (permission.includes("Delete Movies"))
      isUserHasPermissionForDeleteMovies = true;
  });
  return isUserHasPermissionForDeleteMovies;
}

