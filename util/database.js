const mongoose = require('mongoose');
require('dotenv/config')


const connectDB = async(callback) => {
    await mongoose.connect(process.env.DB_CONNECT, {useUnifiedTopology: true, useNewUrlParser: true}).
    then(client => {
        console.log('connected to db')
        callback(client)
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports = connectDB;