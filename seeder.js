const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

dotenv.config({path: './config/config.env'});

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');


const connectDB = require('./config/db');

connectDB();

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log('imported bootcamps...')
        process.exit();
    }catch(err){
        console.log(`couldn't import bootcamps`, err);
    }
}


const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log('deleted bootcamps...')
        process.exit();
    }catch(err){
        console.log(`couldn't delete bootcamps`, err);
    }
}

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d') {
    deleteData();
}


