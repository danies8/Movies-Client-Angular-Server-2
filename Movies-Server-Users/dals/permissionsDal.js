const jsonfile = require("jsonfile");

const usersJsonFilePath = "Data/permissions.json";

exports.readPermissionsFromFile = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(usersJsonFilePath, function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(data);
            }
        })
    });
}

exports.writePermissionsToFile = (fileContent) => {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(usersJsonFilePath, fileContent, function (err) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve({isSucess:true});
            }
        })
    });
}

