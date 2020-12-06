const express = require("express");
const dotenv = require("dotenv");

// load env vars
dotenv.config({path: './config/config.env'});

const app = express();

app.use("/asd",(req, res)=>{
    console.log('asdasd');
    res.send("hello");
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} env on port ${PORT}`));