const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const address = process.argv[2];

if (!address) {
    console.log("Please provide an address")
} else {

    geocode(address, (error, {longitude, latitude, location} = {}) => {

        if (error) {
            return console.log(error)
        } else {
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    console.log(error)
                }
                console.log(location)
                console.log(forecastData)
            })
        }
    })
}