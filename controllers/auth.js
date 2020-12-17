const User = require('../models/User');
const crypto = require('crypto');
// middleware
const asyncHandler = require('../middlewares/async');

// utils
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');


// @desc Register User
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
    const { email, name, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // create token
    sendTokenResponse(user, 201, res);
});


// @desc login User
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('please provide and email and password', 400));
    }

    // check if user with given email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc get logged in user info
// @route POST /api/v1/auth/me
// @access private
exports.getMe = asyncHandler(async (req, res, next) => {
    res.json({
        success: true,
        data: req.user
    })
})


// @desc log out user/ clear cookie
// @route GET /api/v1/auth/logout
// @access private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now + 10),
        httpOnly: true
    })
    
    res.json({
        success: true
    })
})


// @desc update password
// @route  put /api/v1/auth/updatepassword
// @access private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // check current password
    const passwordMatch = await user.matchPassword(req.body.currentPassword);

    if (!passwordMatch){
        return next(new ErrorResponse(`password is incorrect`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
})

// @desc update user details
// @route POST /api/v1/auth/updatedetails
// @access private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        data: user
    })
})


// @desc forgot password
// @route POST /api/v1/auth/forgetpassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    console.log(resetUrl);

    const message = `you are receiving this email because you request the reset password, please make a put request to ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'password reset token',
            message
        });
        res.status(200).json({
            success: true,
            data: 'email sent'
        })
    } catch (err) {
        console.log(err);
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`email could not be sent`, 500));
    }
})

// @desc Reset password
// @route POST /api/v1/auth/resetPassword/:resetToken
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetPasswordToken).digest('hex');

    console.log(0, req.params.resetPasswordToken);
    console.log(1, resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpiration: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorResponse(`Invalid Token or expired`), 400);
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
})


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    // cookie expiration date in days
    const expirationDate = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000);

    const options = {
        expires: expirationDate,
        httpOnly: true
    }

    // only set secure flag to true in production
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

