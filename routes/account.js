const router = require('express').Router();
const account = require('../controllers/account');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const uploadCloud = require('../config/cloudinary.config');

router.get('/:uid', account.getUser);
router.put(
  '/:uid',
  verifyAccessToken,
  uploadCloud.single('avatar'),
  account.updateUser
);

module.exports = router;
