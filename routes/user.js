const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router
    .route('/register')
    .post(userController.createUser);

router
    .route('/login')
    .post(userController.login);

router
    .route('/verify')
    .post(userController.verifyLogin);

module.exports = router;