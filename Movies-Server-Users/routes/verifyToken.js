var jwt = require('jsonwebtoken');
var config = require('../configurations/awtConfig');

//https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/
function verifyToken(req, res, next) {
    var accessToken = req.headers['x-access-token'];
    if (!accessToken)
        return res.json({ errorMessage: 'No token provided.' });

    jwt.verify(accessToken, config.secret, function (err, decoded) {
        if (err)
            return res.json({ errorMessage: 'Failed to authenticate token.' });
          next();
    });
}

module.exports = verifyToken;