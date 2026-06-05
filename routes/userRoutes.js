const router = require('express').Router();
const {createUser, loginUser, getUser} = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register',createUser);
router.post('/login',loginUser);

//curd
router.get('/user',authMiddleware,getUser)

module.exports = router;


  