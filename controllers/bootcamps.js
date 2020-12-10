const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

// @desc get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        const error = new ErrorResponse(`can not find bootcamp with id ${req.params.id}`, 404);
        console.log(2, error.message);
        return next(error);
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc add bootcamp
// @route post /api/v1/bootcamps
// @access private
exports.addBootcamp = asyncHandler(async (req, res, next) => {
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: newBootcamp });
})

// @desc update single bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res) => {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedBootcamp) {
        return res.status(400).json({ success: false });
    }
    res.status(201).json({ success: true, data: updatedBootcamp });
})

// @desc delete single bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res) => {
    const deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!deletedBootcamp) {
        return res.status(400).json({ success: false });
    }
    res.status(201).json({ success: true, data: deletedBootcamp });
})