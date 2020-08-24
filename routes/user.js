const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
    '/updatePassword',
    authController.authCheck,
    authController.updatePassword
);

router.patch(
    '/updateCurrentUser',
    authController.authCheck,
    userController.updateCurrentUser
);
router.delete(
    '/deleteCurrentUser',
    authController.authCheck,
    userController.deleteCurrentUser
);

router
    .route('/')
    .get(userController.getAllUsers)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;