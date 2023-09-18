const express = require('express');
const multer=require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const resetPasswordController = require('./../controllers/resetPasswordController');


const router = express.Router();

router.use((req, res, next) => {
  console.log(`Requested ${req.method} ${req.path}`);
  next();
});

// const upload=multer(
//   {dest: 'public/img/users'}
// );

router.get('/reset-password/:token', (req, res) => {
  console.log("token to be passed to the resetPassword form: ", req.params.token);
  res.render('resetPassword', { token: req.params.token }); 
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', resetPasswordController.resetPassword);


// Protect all routes after this middleware
router.use((req, res, next) => {
  console.log('Before authController.protect', req.path);
  next();
});

router.use(authController.protect);

router.use((req, res, next) => {
  console.log('After authController.protect', req.path);
  next();
});



router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/updateMe',
  //upload.single('photo'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);

//router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
