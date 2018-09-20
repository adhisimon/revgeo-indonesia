"use strict"

const config = require('./config');
const dsGoogle = require('./lib/datasources/google');

module.exports = function(latitude, longitude, cb) {
    dsGoogle.search(latitude, longitude, function(err, result) {
        cb(err, result);
    })
}
