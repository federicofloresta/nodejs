const request = require("request");

const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiZXN0YWZsb3IiLCJhIjoiY2tqbHNzNDFyNTNrYTMzbnljYjd1ZjIweSJ9.15YBL7M5_r6NBzQ4GTAfsQ"

    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback("Unable to connect to location services!", undefined)
        } else if (body.features.length === 0) {
            callback("Unable to find location. Try another search.", undefined)
        } else {
            callback(undefined, `The place that you searched has a latitude of ${latitude} and a longitude of ${longitude} the name of the place is ${location}`)

            }
        })
    };

module.exports = geocode;
