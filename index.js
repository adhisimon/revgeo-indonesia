"use strict"

const dsGoogle = require('./lib/datasources/google');

module.exports = function(latitude, longitude, options, cb) {
    if (typeof cb !== 'function') {
        return;
    }
    
    dsGoogle.reverse(latitude, longitude, options, function(err, result) {
        cb(err, result);
    })
}
