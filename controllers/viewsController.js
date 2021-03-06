const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
  // get tour data from db
  const tours = await Tour.find();
  // build template
  // render template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  // get tour details data from db
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // build template

  // render template
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Register Here',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.getMyTours = catchAsyncError(async (req, res) => {
  // find all Bookings
  const bookings = await Booking.find({ user: req.user.id });

  // find tour with the matched booking id
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      'Your Booking was successful!!! Please check your mail for confirmation.';
  next();
};
