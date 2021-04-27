const fs = require("fs");

const me = fs.readFileSync("1-json.json");
const meParsed = JSON.parse(me);
meParsed.name = "Federico";
meParsed.age = 28;
const meString = JSON.stringify(meParsed);
fs.writeFileSync("1-json.json", meString);


// const bookJSON = JSON.stringify(book);
// fs.writeFileSync("1-json.json", bookJSON);
// const dataBuffer = fs.readFileSync("1-json.json"); // we read the file in, getting our binary data
// const dataJSON = dataBuffer.toString(); //we converted that data into a standard string in JavaScript
// const data = JSON.parse(dataJSON); //parsed that JSON data into an object

// console.log(data.title) // Accessed a property from it