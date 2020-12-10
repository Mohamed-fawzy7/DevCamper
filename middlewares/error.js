const ErrorResponse = require('../utils/errorResponse');
module.exports = (err, req, res, next) => {
    console.log(1,err);
    let error = { ...err };
    error.message = err.message;
    
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    console.log(2,error);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    })
}