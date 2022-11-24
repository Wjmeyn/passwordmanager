var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const Role = require('../_helpers/role');
const authorize = require('../_helpers/authorize');


router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.get('/allusers', authorize(Role.admin),userController.getAllUsers);

//TODO: add the needed routing for setting and getting user goal values. Hint: '/getgoals/:username' Hint2: '/setgoals'

router.get('/getbyusername', userController.getByUsername);
router.get('/getusernames', userController.getUsernames);
router.post('/addcredential', userController.addCredential);
router.post('/sharecredential', userController.shareCredential);
router.get('/getcredentials', userController.getCredentials);
router.get('/getsharedwithme', userController.getSharedWithMe);
router.delete('/:domain', userController.deleteCredential);
router.post('/edit', userController.editCredential);

module.exports = router;
