const express = require('express');
var jwt = require('jsonwebtoken');

const apiMembersBL = require('../../modals/bls/externals/apiMembersBL');
var verifyToken = require('../verifyToken');

const router = express.Router();

    router.route('/getAllMembersSubscriptionData')
    .get(verifyToken,async function (req, resp) {
        try {
           
              let results = await apiMembersBL.getAllMembersSubscriptionData();
              if(results.isSuccess){
               return resp.json({ isSuccess: true,  membersDataArr:results.membersDataArr});
              }
              else{
                 return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
              }
                    
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all members',
                error: err
            });
        }
    });

    router.route('/addMember')
    .post(verifyToken, async function (req, resp) {
        try {
             let results = await apiMembersBL.addMember(req.body);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in adding new member',
                error: err
            });
        }
    });

    router.route('/deleteMember/:memberId')
    .delete(verifyToken, async function (req, resp) {
        try {
            let memberId = req.params.memberId;
             let results = await apiMembersBL.deleteMember(memberId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in deleteing member',
                error: err
            });
        }
    });

    router.route('/getMemberById/:memberId')
    .get(verifyToken, async function (req, resp) {
        try {
            let memberId = req.params.memberId;
             let results = await apiMembersBL.getMemberById(memberId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true, member:results.member});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting member by id',
                error: err
            });
        }
    });

    router.route('/updateMember/:memberId')
    .put(verifyToken, async function (req, resp) {
        try {
            let memberId = req.params.memberId;
             let results = await apiMembersBL.updateMember(memberId, req.body);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in update member',
                error: err
            });
        }
    });

    
    router.route('/subscirbeToNewMovie')
    .post(verifyToken, async function (req, resp) {
        try {
             let results = await apiMembersBL.subscirbeToNewMovie(req.body);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in subscirbe to new movie',
                error: err
            });
        }
    });

    router.route('/getAllMembersSubscriptionDataFilterByMemberId/:memberId')
    .get(verifyToken, async function (req, resp) {
        try {
            let memberId = req.params.memberId;
             let results = await apiMembersBL.getAllMembersSubscriptionDataFilterByMemberId(memberId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true, membersDataArr:results.membersDataArr});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting member by id',
                error: err
            });
        }
    });

    
module.exports = router;