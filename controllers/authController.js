const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//signup
exports.signup = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // token
  const token = signToken(newUser._id);
  res.status(201).json({
    token,
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // check if user and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('Incorrect email or password, Please try again', 401)
    );
  }

  // if passed, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    message: 'login successful',
    token,
  });
});

// protect routes---Implementing access to some routes for only autheticated users
exports.protectRoute = catchAsyncError(async (req, res, next) => {
  // get token and confirm its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  // verify token

  // check if user still exists

  // check if user changed password after token was issued
  next();
});
