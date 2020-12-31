const axios = require('axios');

exports.getMembers = function()
{
    return axios.get("https://jsonplaceholder.typicode.com/users");
}