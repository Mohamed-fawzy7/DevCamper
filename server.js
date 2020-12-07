const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');
const logger = require('./middlewares/logger');
const bootcampsRoutes = require('./routes/bootcamps');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to db
connectDB();

// routes
const app = express();

// json body parser
app.use(express.json());

// loggin middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use("/api/v1/bootcamps", bootcampsRoutes);



const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} env on port ${PORT}`.yellow.bold));

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline);
    server.close(()=>{
        process.exit(1);
    });
})