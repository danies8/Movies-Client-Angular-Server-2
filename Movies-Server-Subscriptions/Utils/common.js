const moment = require('moment');

function isNumeric (num) {
    return !isNaN(num)
}

exports.requiredDateValidator = [
	function (str) {
        const splitedStr = str.split('-');
        const year = splitedStr[0];
        const month = splitedStr[1];
        const day = splitedStr[2];
        
        if (!isNumeric(year)) {
            return false;
        }
        if (!isNumeric(month) || !(parseInt(month) >=1 && parseInt(month) <=12)) {
            return false;
        }
        if (!isNumeric(day) || !(parseInt(day) >=1 && parseInt(day) <=31)) {
            return false;
        }
    
        var d = moment(str, 'YYYY-MM-DD');
        if (d == null || !d.isValid()) return false;
        return str.indexOf(d.format('YYYY-MM-DD')) >= 0
	},
	'Please supply a valid email address'	
]
