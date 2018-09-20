"use strict";

const should = require('should');
const revgeo = require('./index');
const dsGoogle = require('./lib/datasources/google');

const patra2 = require('./test-data/google-komplek-patra2.json');

describe('#main', function() {

    describe('#google', function() {

        describe('#parse', function() {

            const result = dsGoogle.parse(patra2);

            it('should return correct country', function() {
                result.country.long_name.should.equal('Indonesia');
            })

            it('should return correct province', function() {
                result.province.long_name.should.equal('Daerah Khusus Ibukota Jakarta');
            })

            it('should return correct city or regency', function() {
                result.city_or_regency.long_name.should.equal('Kota Jakarta Pusat');
            })

            it('should return correct district', function() {
                result.district.long_name.should.equal('Cempaka Putih');
            })

            it('should return correct kelurahan', function() {
                result.kelurahan.long_name.should.equal('Cempaka Putih Timur');
            })

        })

    })

})
