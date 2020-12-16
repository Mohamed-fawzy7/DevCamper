const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

// @desc get all courses
// @route GET /api/v1/courses 
// @route GET /api/v1/bootcamps/:bootcampid/courses 
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).send(res.advancedResults);
    }
});


// @desc get course
// @route GET /api/v1/courses/:id
// @access public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`course with id: ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: course
    })
});


// @desc add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    
    // check if bootcamp exist
    if (!bootcamp) {
        return next(new ErrorResponse(`bootcamp with id: ${req.params.bootcampId} not found`, 404));
    }

    // make sure that the user is the owner or admin
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorized`, 401));
    }

    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc update course
// @route PUT /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`course with id: ${req.params.id} not found`, 404));
    }

    // make sure that the user is the owner or admin
    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorized`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: course
    });
});


// @desc delete course
// @route DELETE /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    
    // check if user exist
    if (!course) {
        return next(new ErrorResponse(`course with id: ${req.params.id} not found`, 404));
    }

    // make sure that the user is the owner or admin
    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorized`, 401));
    }
    await course.remove();

    res.status(200).json({
        success: true,
        data: course
    });
});