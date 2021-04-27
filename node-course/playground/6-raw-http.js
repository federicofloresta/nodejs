const http = require("http");
url = "http:api.weatherstack.com/current?access_key=05be1d425c893a195944d013ab15bc06&query=40,-75.2563 &units=f";

const request = http.request(url, (response) => {
    let data = ""
    response.on("data", (chunk) => {
        data += chunk.toString()
        console.log(chunk)
    })

    response.on("end", () => {
        const body = JSON.parse(data)
        console.log(body)
    })

});

request.on("error", (error) => {
    console.log("an error occured", error)
})

request.end();