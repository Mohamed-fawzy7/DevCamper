const { getCourses, getCourse, addCourse, deleteCourse, updateCourse } = require('../controllers/courses');
const router = require('express').Router({ mergeParams: true });
const express = require('express');

router.route('/')
    .get(getCourses)
    .post(addCourse);

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;