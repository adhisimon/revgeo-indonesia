"use strict"

const config = require('./config');
const dsGoogle = require('./lib/datasources/google');

module.exports = function(latitude, longitude, options, cb) {
    dsGoogle.reverse(latitude, longitude, options, function(err, result) {
        cb(err, result);
    })
}
