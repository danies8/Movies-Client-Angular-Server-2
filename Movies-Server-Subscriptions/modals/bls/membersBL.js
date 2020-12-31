const Member = require('../schemas/membersSchema');

exports.getAllMembers = function () {
    return new Promise((resolve, reject) => {
        Member.find({}, function (err, members) {
            if (err) {
                reject(err);
            }
            else {
                resolve(members);
            }
        })
    })
}

exports.getMemberById = function (id) {
    return new Promise((resolve, reject) => {
        Member.findById(id, function (err, member) {
            if (err) {
                reject(err);
            }
            else {
                resolve(member);
            }
        })
    })
}


exports.addMember = function (memberObj) {
    return new Promise((resolve, reject) => {
        const member = new Member({
            name: memberObj.name,
            email: memberObj.email,
            city: memberObj.city,
        });

        member.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(member._id);
            }
        })
    })
}


exports.updateMember = function (id, memberObj) {
    return new Promise((resolve, reject) => {
        Member.findByIdAndUpdate(id,
            {
                name: memberObj.name,
                email: memberObj.email,
                city: memberObj.city,
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve('Member Updated');
                }
            })
    })
}

exports.deleteMember = function (id) {
    return new Promise((resolve, reject) => {
        Member.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('Member Deleted');
            }
        })

    })
}