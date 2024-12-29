const router = require('express').Router();
const auth = require('../controllers/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/refreshtoken', auth.refreshAccessToken);

module.exports = router;
