const express = require('express');

const authController = require('../controllers/auth');
const router = express.Router();

// handle the get requet for login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// handle reqeusts for logout
router.post('/logout', authController.postLogout);

module.exports = router;