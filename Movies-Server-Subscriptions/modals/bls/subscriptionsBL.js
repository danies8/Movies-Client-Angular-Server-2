const SubScription = require('../schemas/subscriptionsSchema');

exports.getAllSubScriptions = function () {
    return new Promise((resolve, reject) => {
        SubScription.find({}, function (err, subScription) {
            if (err) {
                reject(err);
            }
            else {
                resolve(subScription);
            }
        })
    })
}

exports.getSubScriptionById = function (id) {
    return new Promise((resolve, reject) => {
        SubScription.findById(id, function (err, subScription) {
            if (err) {
                reject(err);
            }
            else {
                resolve(subScription);
            }
        })
    })
}


exports.addSubScription = function (subscriptionObj) {
    return new Promise((resolve, reject) => {
        const subScription = new SubScription({
            memberId: subscriptionObj.memberId,
            movies: subscriptionObj.movies,
         });

         subScription.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(subScription._id);
            }
        })
    })
}


exports.updateSubScription = function (id, subscriptionObj) {
    return new Promise((resolve, reject) => {
        SubScription.findByIdAndUpdate(id,
            {
                memberId: subscriptionObj.memberId,
                movies: subscriptionObj.movies,
              }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve('SubScription Updated');
                }
            })
    })
}

exports.deleteSubScription = function (id) {
    return new Promise((resolve, reject) => {
        SubScription.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('SubScription Deleted');
            }
        })

    })
}
