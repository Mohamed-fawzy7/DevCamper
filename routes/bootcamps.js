const { getBootcamp, getBootcamps, addBootcamp, deleteBootcamp, updateBootcamp } = require('../controllers/bootcamps');
const router = require('express').Router();
const express = require('express');

router.route('/')
    .get(getBootcamps)
    .post(addBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;