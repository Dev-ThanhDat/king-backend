const router = require('express').Router();
const pin = require('../controllers/pin');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const uploadCloud = require('../config/cloudinary.config');

router.get('/', pin.getPins);
router.post(
  '/',
  verifyAccessToken,
  uploadCloud.single('thumbnail'),
  pin.createPin
);
router.get('/:pid', pin.getPin);
router.put(
  '/:pid',
  verifyAccessToken,
  uploadCloud.single('thumbnail'),
  pin.updatePin
);
router.delete('/:pid', verifyAccessToken, pin.deletePin);

module.exports = router;
