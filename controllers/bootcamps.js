// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res) => {
    res.json({
        success: true,
        msg: 'all bootcamps'
    })
} 

// @desc get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res) => {
    res.json({
        success: true,
        msg: `bootcamp with id ${req.params.id}`
    });
}

// @desc add bootcamp
// @route post /api/v1/bootcamps
// @access private
exports.addBootcamp = (req, res) => {
    res.json({
        success: true,
        msg: `created new bootcamp`
    });
} 

// @desc update single bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res) => {
    res.json({
        success: true,
        msg: `updated bootcamp with id ${req.params.id}`
    });
} 

// @desc delete single bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res) => {
    res.json({
        success: true,
        msg: `deleted bootcamp with id ${req.params.id}`
    });
} 