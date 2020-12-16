const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const path = require('path');


// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    // sending results
    res.status(200).json(res.advancedResults);
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
    req.body.user = req.user.id;
    
    // check if publisher already published a bootcamp before
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

    // make sure that the user is the owner or admin
    if(publishedBootcamp && req.user.role !=='admin'){
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`), 400);
    }
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: newBootcamp });
})

// @desc update single bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res) => {
    let updatedBootcamp = await Bootcamp.findById(req.params.id);

    //check if bootcamp exist
    if (!updatedBootcamp) {
        return next(new ErrorResponse(`Bootcamp not found`, 404));
    }

    // make sure that the user is the owner or admin
    if(updatedBootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorized`, 401));
    }

    //update bootcamp
    updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({ success: true, data: updatedBootcamp });
})

// @desc delete single bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res) => {
    const deletedBootcamp = await Bootcamp.findById(req.params.id);

    // check if bootcamp exist
    if (!deletedBootcamp) {
        return res.status(400).json({ success: false });
    }

    // make sure that the user is the owner or admin
    if(updatedBootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorized`, 401));
    }

    deletedBootcamp.remove();
    res.status(201).json({ success: true, data: deletedBootcamp });
})


// @desc get bootcamps withing a raduis 
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res) => {
    const { zipcode, distance } = req.params;

    // get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    console.log('zipcode, lat and lng', Number(zipcode), lat, lng)

    // calc radius using radius
    // divide distance by radius of earth
    // earth radius = 3963 miles
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // make sure that the user is the owner or admin
    if(updatedBootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not Authorized`, 401));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});
