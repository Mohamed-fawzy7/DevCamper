const { getBootcamp, getBootcamps, addBootcamp, deleteBootcamp, updateBootcamp, getBootcampsInRadius } = require('../controllers/bootcamps');
const router = require('express').Router();
const express = require('express');

// include other resource routers
const coursesRoutes = require('./courses');

router.use('/:bootcampId/courses', coursesRoutes);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
    .get(getBootcamps)
    .post(addBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;