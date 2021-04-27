const app = require("./app");
const port = process.env.PORT;
/*

W/o middleware: new request -> run route handler

W/ middleware: new request -> do something -> run route handler

*/

app.listen(port, () => {
    console.log(`Server is running in ${port}`)
});


//encrypted; andrew -> pekfnbghjyewkwnfds -> andrew
// bcrypt; One way algorithem; myPass -> bfuibeibibiuh#@Dgfs