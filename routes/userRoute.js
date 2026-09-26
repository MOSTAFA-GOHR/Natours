
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authControllers = require('./../controllers/authControllers');
const bookingRouter = require('./bookingRoutes');

router.use('/:userId/booking', bookingRouter)

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);
router.post('/forgetPassword', authControllers.forgetPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);



// protect all route after this middelware
router.use(authControllers.protect);
router.patch('/updateMyPassword', authControllers.updatePassword);
router.patch('/updateMe', userController.uploadUserPhoto,
  userController.resizingUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

router.use(authControllers.restrictTo('admin'))
router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;