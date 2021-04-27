const request = require("request");

const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiZXN0YWZsb3IiLCJhIjoiY2tqbHNzNDFyNTNrYTMzbnljYjd1ZjIweSJ9.15YBL7M5_r6NBzQ4GTAfsQ"

    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback("Unable to connect to location services!")
        } else if (body.features.length === 0) {
            callback("Unable to find location. Try another search.")
        } else {
            callback(undefined, { 
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
};

module.exports = geocode;

//pull request is a feauture suggestion