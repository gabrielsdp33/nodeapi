const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');


router.get('/', checkAuth, UsersController.users_get_all);

router.get('/:id', checkAuth, UsersController.users_get_user);

router.post('/signup', UsersController.user_signup);

router.post('/signin', UsersController.user_signin);

module.exports = router;
