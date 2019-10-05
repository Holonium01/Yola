const mongoose = require('mongoose');

let mongodbUrl = process.env.DATABASEURL || 'mongodb://localhost:27017/gist_app';
mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        // Use ssl connection (needs to have a mongod server with ssl support). Default is false. Change to true when using ssl
        ssl: false,
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000
    })
    .then(() => {
        console.log(`connected to DB on ${mongodbUrl}`)
    })
    .catch((err) => {
        console.log(`An error occured. could not connect to ${mongodbUrl}`)
    });

module.exports.mongoose = mongoose;