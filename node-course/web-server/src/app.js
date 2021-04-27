const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");

const app = express();
const port = process.env.PORT || 3000;

//Define Paths for Express config
const publicDirectoryHome = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup Handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryHome));

app.get("", (req, res) => {
    res.render("index", {
        title: "Home Page",
        name: "Federico Floresta"
    })
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Federico Floresta"
    })
});

app.get("/help", (req, res) => {
    res.render("help", {
        message: "This will help you",
        name: "Federico Floresta",
        title: "Help Page"
    })
});

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Address must be provided"
        })
    }
    geocode(req.query.address, (error, { location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        res.send ({
            location,
            address: req.query.address
        })
    })

    });

//This is used for E-commerce websites 
app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }

    res.send({
        products: []
    })
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Federico Floresta",
        errorMessage: "Help article not found"
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Federico Floresta",
        errorMessage: "Page not found"
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});