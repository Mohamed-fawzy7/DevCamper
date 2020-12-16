const { getBootcamp, getBootcamps, addBootcamp, deleteBootcamp, updateBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');
const router = require('express').Router();

// model
const Bootcamp = require('../models/Bootcamp');

// include other resource routers
const coursesRoutes = require('./courses');

// middlewares
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth');


// routes
router.use('/:bootcampId/courses', coursesRoutes);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('admin', 'publisher'), addBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('admin', 'publisher'), updateBootcamp)
    .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

router.route('/:id/photo')
    .put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload);

module.exports = router;