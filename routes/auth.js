const express = require('express');
// need a subpackage 'check'
// gives you a check function you import from this package
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// handle the get requet for login
router.get('/login', authController.getLogin);
router.post('/login', 
[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    // trim removes excess white space
    .trim()
],
authController.postLogin);

// copied from setup
router.get('/signup', authController.getSignup);

// handle reqeusts for logout
router.post('/logout', authController.postLogout);

// copied from setup
// check means you're interested in that field
// withMessage means the message right before it
router.post('/signup', 
[
    // extract email from header cookies anywhere
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    // create your own custom validation by passing value and returning true or throwing an error
    .custom((value, {req}) => {
        // if (value === 'test@test.com') {
        //     throw new Error('This email address is forbidden')
        // }
        // return true;
        // check if email already exists
        return User.findOne({email: value})
        .then(userDoc => {
            // if this is defined then we do have a user
            if (userDoc) {
                return Promise.reject(
                    "Email exists already, please pick a different one."
                );
            }
        });
    })
    .normalizeEmail(),
    // check for password in body of request
    // please enter... becomes a default message for all validators
    body('password',
         'Please enter a password with only numbers and text and at least 5 characters'
    )
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(),
    // custom validator that checks if the passwords match
    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match')
        }
        return true
    })
    
]
,authController.postSignup);


// handle get request for reset
router.get('/reset', authController.getReset);

// handle post request for reset
router.post('/reset', authController.postReset);

// has to be named :token because it's looking for in params
router.get('/reset/:token', authController.getNewPassword);

// add a post request to new password
router.post('/new-password', authController.postNewPassword);

module.exports = router; 