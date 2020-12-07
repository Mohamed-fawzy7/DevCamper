const Bootcamp = require('../models/Bootcamp');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
    } catch (error) {
        res.status(400).json({success: false});
    }
}

// @desc get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        res.status(400).json({ success: false });
    }
}

// @desc add bootcamp
// @route post /api/v1/bootcamps
// @access private
exports.addBootcamp = async (req, res) => {
    try {
        const newBootcamp = await Bootcamp.create(req.body);
        res.status(201).json({ success: true, data: newBootcamp });
    } catch (error) {
        res.status(400).json({ success: false });
    }
}

// @desc update single bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res) => {
    try {
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!updatedBootcamp){
            return res.status(400).json({ success: false });    
        }
        res.status(201).json({ success: true, data: updatedBootcamp });
    } catch (error) {
        res.status(400).json({ success: false });
    }
}

// @desc delete single bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res) => {
    try {
        const deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!deletedBootcamp){
            return res.status(400).json({ success: false });    
        }
        res.status(201).json({ success: true, data: deletedBootcamp });
    } catch (error) {
        res.status(400).json({ success: false });
    }
} 