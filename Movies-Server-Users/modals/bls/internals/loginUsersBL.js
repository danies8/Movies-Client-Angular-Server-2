const axios = require('axios');

const Login = require('../../schemas/loginUsersSchema');

exports.getAllLogins = function () {
    return new Promise((resolve, reject) => {
        Login.find({}, function (err, logins) {
            if (err) {
                reject(err);
            }
            else {
                resolve(logins);
            }
        })
    })
}

exports.getLoginById = function (id) {
    return new Promise((resolve, reject) => {
        Login.findById(id, function (err, login) {
            if (err) {
                reject(err);
            }
            else {
                resolve(login);
            }
        })
    })

}


exports.addLogin = function (loginObj) {
    return new Promise((resolve, reject) => {
        const login = new Login({
            userName: loginObj.userName,
            password: loginObj.password,
        });

        login.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(login._id);
            }
        })
    })
}


exports.updateLogin = function (id, loginObj) {
    return new Promise((resolve, reject) => {
        Login.findByIdAndUpdate(id,
            {
                userName: loginObj.userName,
                password: loginObj.password,
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve('Login Updated');
                }
            })
    })
}

exports.deleteLogin = function (id) {
    return new Promise((resolve, reject) => {
        Login.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('Login Deleted');
            }
        })

    })
}


