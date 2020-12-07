const mongoose = require('mongoose');

const connectDB = async () => {
        const connection = await mongoose.connect(process.env.MONGO_URi, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log(`mongodb connected: ${connection.connection.host}`.yellow.bold);
}

module.exports = connectDB;