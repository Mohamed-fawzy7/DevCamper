const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

// @desc get all courses
// @route GET /api/v1/courses 
// @route GET /api/v1/bootcamps/:bootcampid/courses 
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
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
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp){
        return next(new ErrorResponse(`bootcamp with id: ${req.params.bootcampId} not found`, 404));
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
    if (!course){
        return next(new ErrorResponse(`course with id: ${req.params.id} not found`, 404));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body,{
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
    if (!course){
        return next(new ErrorResponse(`course with id: ${req.params.id} not found`, 404));
    }
    await course.remove();
    
    res.status(200).json({
        success: true,
        data: course
    });
});