const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

// GET USER
const getUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid)
    .select('-refreshToken -password')
    .populate('pins');
  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : 'User not found!'
  });
});

// UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  let updateData = { ...req.body };
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error('Missing inputs!');
  if (req.file) {
    const user = await User.findById(uid);
    if (user && user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }
    updateData.avatar = {
      public_id: req.file.filename,
      url: req.file.path
    };
  }
  const response = await User.findByIdAndUpdate(uid, updateData, {
    new: true
  }).select('-password -refreshToken');
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : 'Something went wrong!'
  });
});

module.exports = {
  getUser,
  updateUser
};
