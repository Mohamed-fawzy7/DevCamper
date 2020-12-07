const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');

const logger = require('./middlewares/logger');
const bootcampsRoutes = require('./routes/bootcamps');

// load env vars
dotenv.config({ path: './config/config.env' });

// routes
const app = express();

// loggin middle ware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use("/api/v1/bootcamps", bootcampsRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} env on port ${PORT}`));