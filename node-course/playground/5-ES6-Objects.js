//Object property shorthand

const request  = require("util");

const name = "Federico";
const userAge = 28;

const user = {
    name,
    age: userAge,
    location: "California"
};

console.log(user);


//Object Destructuring

const product = {
    label: "Red Notebook",
    price: 3,
    stock: 301,
    salePrice: undefined,
    rating: 4.5
};

// const label = product.label;
// const stock = product.stock;

// const {label:productLabel, stock, rating = 5} = product 
// console.log(productLabel);
// console.log(stock);
// console.log(rating);

// Default parameters and how we can use them with destructuring
const transaction = (type, { label, stock = 0 } = {}) => {
console.log(type, label, stock)
}

transaction("order", product)