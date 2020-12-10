const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

dotenv.config({path: './config/config.env'});

const Bootcamp = require('./models/Bootcamp');
const connectDB = require('./config/db');

connectDB();

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));

const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps);
        console.log('imported bootcamps...')
        process.exit();
    }catch(err){
        console.log(`couldn't import bootcamps`, err);
    }
}


const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany();
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


