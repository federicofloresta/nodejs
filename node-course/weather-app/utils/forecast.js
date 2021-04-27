const request = require("request"); 

const forecast = (longitude, latitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=05be1d425c893a195944d013ab15bc06&query=" + longitude + "," + latitude + "&units=f"

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback("Unable to connect to weather service!", undefined)
        } else if (body.error) {
            callback("Unable to find weather. Try another search.", undefined)
        } else {
           
            callback(undefined, body.daily.data[0].summary + " It is currently " + body.current.temperature + " degrees out. There is a " + body.current.precipProbability + "% chance of rain.")
        }
    });
};

module.exports = forecast;