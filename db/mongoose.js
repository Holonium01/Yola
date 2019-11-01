const mongoose = require('mongoose');

let mongodbUrl = 'mongodb://localhost:27017/gisted_app';
mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
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
        console.log(err)
    });

module.exports.mongoose = mongoose;