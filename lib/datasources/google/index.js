"use strict";

const request = require('request');
const config = require('../../../config.json');

const url = 'https://maps.googleapis.com/maps/api/geocode/json';

function fetch(latitude, longitude, cb) {
    if (typeof cb !== 'function') return;

    const requestOptions = {
        url: url,
        qs: {
            latlng: `${latitude},${longitude}`,
            key: config.google.key
        },
        proxy: config.google.proxy || config.proxy
    }

    request(requestOptions, function(err, res, body) {
        if (err) {
            cb(err);
            return;
        }

        cb(null, body);
    })
}

function selectByType(data, result_type) {
    const results = [];

    if (!data || !Array.isArray(data)) {
        return [];
    }

    for (let key in data) {

        const result = typeof key === 'string' ? data[key] : key;

        if (!result || !result.types || !Array.isArray(result.types)) continue;

        if (result.types.indexOf(result_type) >= 0) {
            results.push(result);
        }
    }

    return results;
}

function getFirstData(data) {
    if (!data || !data.length) {
        return;
    }

    return data[0];
}

function getFirstPostalCodeData(data) {
    return getFirstData(selectByType(data, 'postal_code'));
}

function getFirstCountryData(data) {
    return getFirstData(selectByType(data, 'country'));
}

function getFirstProvinceData(data) {
    return getFirstData(selectByType(data, 'administrative_area_level_1'));
}

function getFirstCityOrRegencyData(data) {
    return getFirstData(selectByType(data, 'administrative_area_level_2'));
}

function getFirstDistrictData(data) {
    return getFirstData(selectByType(data, 'administrative_area_level_3'));
}

function getFirstKelurahanData(data) {
    return getFirstData(selectByType(data, 'administrative_area_level_4'));
}

function parse(data) {

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch(e) {
            return;
        }
    }

    const postalCodeData = getFirstPostalCodeData(data.results);
    const addressComponents = postalCodeData.address_components;

    const countryData = getFirstCountryData(addressComponents);
    const provinceData = getFirstProvinceData(addressComponents);
    const cityOrRegencyData = getFirstCityOrRegencyData(addressComponents);
    const districtData = getFirstDistrictData(addressComponents);
    const kelurahanData = getFirstKelurahanData(addressComponents);

    return {
        country: {
            name: countryData && countryData.long_name ? countryData.long_name : null,
            long_name: countryData && countryData.long_name ? countryData.long_name : null,
            short_name: countryData && countryData.short_name ? countryData.short_name : null
        },
        province: {
            name: provinceData && provinceData.long_name ? provinceData.long_name : null,
            long_name: provinceData && provinceData.long_name ? provinceData.long_name : null,
            short_name: provinceData && provinceData.short_name ? provinceData.short_name : null
        },
        city_or_regency: {
            name: cityOrRegencyData && cityOrRegencyData.long_name ? cityOrRegencyData.long_name : null,
            long_name: cityOrRegencyData && cityOrRegencyData.long_name ? cityOrRegencyData.long_name : null,
            short_name: cityOrRegencyData && cityOrRegencyData.short_name ? cityOrRegencyData.short_name : null
        },
        district: {
            name: districtData && districtData.long_name ? districtData.long_name : null,
            long_name: districtData && districtData.long_name ? districtData.long_name : null,
            short_name: districtData && districtData.short_name ? districtData.short_name : null
        },
        kelurahan: {
            name: kelurahanData && kelurahanData.long_name ? kelurahanData.long_name : null,
            long_name: kelurahanData && kelurahanData.long_name ? kelurahanData.long_name : null,
            short_name: kelurahanData && kelurahanData.short_name ? kelurahanData.short_name : null
        }
    }
}

function reverse(latitude, longitude, cb) {
    fetch(latitude, longitude, function(err, raw) {
        if (err) {
            cb(err);
            return;
        }

        const result = parse(raw);

        cb(null, result);
    })
}

exports.reverse = reverse;
exports.fetch = fetch;
exports.parse = parse;
