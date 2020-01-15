/**
 * connect to mongodb and return mongoose connection
 */
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;

const db = Mongoose.createConnection("mongodb://mongo:27017/expressmongo");

module.exports = db;
