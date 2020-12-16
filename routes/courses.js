// imports
const router = require('express').Router({ mergeParams: true });

// controller
const { getCourses, getCourse, addCourse, deleteCourse, updateCourse } = require('../controllers/courses');

// model
const Course = require('../models/Course');

// middlewares
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth');



const advancedResultsMiddleWareForCourses = advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
});

router.route('/')
    .get(advancedResultsMiddleWareForCourses, getCourses)
    .post(protect, authorize('admin', 'publisher'), addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('admin', 'publisher'), updateCourse)
    .delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;