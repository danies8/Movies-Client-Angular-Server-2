const express = require('express');

const tempBL = require('../modals/bls/tempBL');

const router = express.Router();

router.route('/')
    .get(async function (req, resp) {
        try {
        await tempBL.insertSubscriptionWebServiceDataToDB()
        return resp.json({ isSuccess: true });
    }
    catch (err) {
        return resp.status(500).json({
            message: 'Error in saving subscription data from web services to db',
            error: err
        });
    }
});

module.exports = router;