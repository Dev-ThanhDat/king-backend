const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken
} = require('../middlewares/jwt');

// REGISTER USER
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing inputs!'
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new Error('Email has existed!');
  } else {
    const newUser = await User.create(req.body);
    return res.status(201).json({
      success: newUser ? true : false,
      message: newUser
        ? 'Register is successfully. Please go login!'
        : 'Something went wrong!'
    });
  }
});

// LOGIN USER
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: 'Missing inputs!'
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, refreshToken, ...userData } = response.toObject();
    const accessToken = generateAccessToken(response._id);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
      success: true,
      message: 'Login successfully!',
      accessToken,
      userData
    });
  } else {
    throw new Error('Invalid credentials!');
  }
});

// LOGOUT
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error('No refresh token in cookies!');
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: '' },
    { new: true }
  );
  res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  return res.status(200).json({
    success: true,
    message: 'Logout successfully!'
  });
});

// REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error('No refresh token in cookies!');
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id)
      : 'Refresh token not matched!'
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken
};
