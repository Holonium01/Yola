// const mongoose = require('mongoose');

// let mongodbUrl = process.env.DATABASEURL;
// mongoose.connect(mongodbUrl, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true,
//         // sets how many times to try reconnecting
//         reconnectTries: Number.MAX_VALUE,
//         // sets the delay between every retry (milliseconds)
//         reconnectInterval: 1000
//     })
//     .then(() => {
//         console.log(`connected to DB on ${mongodbUrl}`)
//     })
//     .catch((err) => {
//         console.log(`An error occured. could not connect to ${mongodbUrl}`)
//     });

// module.exports.mongoose = mongoose;