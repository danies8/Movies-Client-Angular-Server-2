const usersDal = require('../../../dals/usersDal');

exports.getAllUsers = async function () {
    return await usersDal.readUsersFromFile();
}

exports.getUserById = async function (id) {
    let usersData = await usersDal.readUsersFromFile();
    let users = usersData.users;
    if (users.length > 0) {
        return users.filter(user => user.id == id)[0];
    }
}

exports.addUser = async function (userObj) {
    let usersData = await usersDal.readUsersFromFile();
    let users = usersData.users;
    if (userObj) {
        userObj.id = await this.getNextMaxUserId();
        users.push({ ...userObj });
        usersData = { ...usersData, users: users };
        await usersDal.writeUsersToFile(usersData);
        return userObj.id;
    }
}

exports.updateUser = async function (id, userObj) {
    let usersData = await usersDal.readUsersFromFile();
    let users = usersData.users;
    if (users.length > 0 && userObj) {
        let index = users.findIndex(user => user.id == id);
        if (index > -1) {
            userObj.id = id;
            users[index] = userObj;
            usersData = { ...usersData, users:users };
            await usersDal.writeUsersToFile(usersData);
        }
    }
}

exports.deleteUser = async function (id) {
    let usersData = await usersDal.readUsersFromFile();
    let users = usersData.users;
    if (users.length > 0 && id) {
        let index = users.findIndex(user => user.id == id);
        if (index > -1) {
            users.splice(index, 1);
            usersData = { ...usersData, users: users };
            await usersDal.writeUsersToFile(usersData);
        }
    }
}

exports.getNextMaxUserId = async () => {
     let usersData = await usersDal.readUsersFromFile();
    let users = usersData.users;
    if (users.length > 0) {
        let maxUserId = users.map(user => user.id).sort((a, b) => a - b)[
            users.length - 1
        ]
        if (maxUserId == undefined) {
            return 1;
        }

        return maxUserId + 1;
    } else {
        return 1;
    }
}

