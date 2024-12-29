const Pin = require('../models/pin');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

// CREATE A PIN
const createPin = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs!');
  const newPin = await Pin.create({
    ...req.body,
    thumbnail: {
      public_id: req.file ? req.file.filename : null,
      url: req.file ? req.file.path : null
    },
    author: { _id }
  });
  await User.findByIdAndUpdate(
    _id,
    { $push: { pins: newPin._id } },
    { new: true }
  );
  return res.status(201).json({
    success: newPin ? true : false,
    createdPin: newPin ? newPin : "Can't create new pin!"
  });
});

// UPDATE A PIN
const updatePin = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  let updateData = { ...req.body };
  if (req.file) {
    const pin = await Pin.findById(pid);
    if (pin && pin.thumbnail && pin.thumbnail.public_id) {
      await cloudinary.uploader.destroy(pin.thumbnail.public_id);
    }
    updateData.thumbnail = { public_id: req.file.filename, url: req.file.path };
  }
  const response = await Pin.findByIdAndUpdate(pid, updateData, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updatedPin: response ? response : "Can't update pin!"
  });
});

// DELETE A PIN
const deletePin = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  const pin = await Pin.findByIdAndDelete(pid);
  if (pin && pin.thumbnail && pin.thumbnail.public_id) {
    await cloudinary.uploader.destroy(pin.thumbnail.public_id);
  }
  await User.findByIdAndUpdate(
    _id,
    { $pull: { pins: pin._id } },
    { new: true }
  );
  return res.status(200).json({
    success: pin ? true : false,
    deletedPin: pin ? 'Deleted successfully!' : 'Something went wrong!'
  });
});

// GET ALL PIN
const getPins = asyncHandler(async (req, res) => {
  const query = req.query?.query || '';
  const page = +req.query?.page || 1;
  const limit = +req.query?.limit || +process.env.LIMIT_PIN;
  const skip = (page - 1) * limit;
  const response = await Pin.find({
    $or: [
      {
        title: { $regex: query, $options: 'i' }
      },
      {
        category: { $regex: query, $options: 'i' }
      }
    ]
  })
    .sort('title')
    .skip(skip)
    .limit(limit)
    .populate('author', 'username email avatar');
  return res.status(200).json({
    success: true,
    pins: response ? response : "Can't get all pins!"
  });
});

// GET A PIN
const getPin = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const response = await Pin.findById(pid).populate(
    'author',
    'username email avatar'
  );
  return res.status(200).json({
    success: response ? true : false,
    pin: response ? response : "Can't get a pin!"
  });
});

module.exports = {
  createPin,
  updatePin,
  deletePin,
  getPins,
  getPin
};
