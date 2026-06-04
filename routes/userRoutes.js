const router = require('express').Router();
const {createUser} = require('../controllers/userController')

router.post('/register',createUser);
// router.post('/login',loginUser);

module.exports = router;


  