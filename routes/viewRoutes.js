const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/signup', viewsController.getSignUpForm);


router.get('/', authController.isLoggedIn, viewsController.getOverview);
//first checks if the user is logged in (without necessarily blocking access if they aren't) using authController.isLoggedIn

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
//router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/forgot-password-link', viewsController.getForgotPasswordForm);
// router.get('/resetPassword/:token', viewsController.resetPasswordPage);

router.get('/me', authController.protect, viewsController.getAccount);
//if add protect, then must logged in(has cookie) to view the content

router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
