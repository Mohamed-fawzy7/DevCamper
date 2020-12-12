const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');


// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // copying reqQuery
    let reqQuery = { ...req.query };
    
    // defining removed fields from seach query
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(field => delete reqQuery[field]);

    // adding $ to mongoose operators
    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/, match => `$${match}`);
    
    // querying with options
    query = Bootcamp.find(JSON.parse(queryString)).populate('courses');
    
    // selecting certain fields if select field is available
    if (req.query.select) {
        const selectedFields = req.query.select.split(',').join(' ');
        query.select(selectedFields);
    }
    
    // sorting
    if(req.query.sort){
        const sortFields = req.query.sort.split(',').join(' ');
        query.sort(sortFields);
    } else {
        query.sort('-createdAt');
    }

    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const documentsCount = await Bootcamp.countDocuments();
    query.skip(startIndex).limit(limit);
    const pagination = {};
    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    if(endIndex < documentsCount){
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    
    // fetching query
    const bootcamps = await query;

    // sending results
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
        pagination
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
    const deletedBootcamp = await Bootcamp.findById(req.params.id);
    if (!deletedBootcamp) {
        return res.status(400).json({ success: false });
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