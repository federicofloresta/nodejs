const supertest = require("supertest");
const app = require("../src/app");
const User = require("../src/db/models/user");
const { userOne, userOneId, setUpDatabase } = require("../features/db");

//This will delete the database before the test will run
//In testing purposes we would like to have this done because this is only testing, and it will make it useless if we do not
//beforeEach(setUpDatabase);

beforeEach(setUpDatabase)

test("Should signup a new user", async () => {
    const response = await supertest(app)
    .post("/users")
    .send({
        name: "Federico Floresta",
        email: "Federicofloresta@example.com",
        password: "Red1234!@#"
    }).expect(201)

    //Fetch the user from the database 
    const user = await User.findById(response.body.user._id) //we are trying to fetch that user from the database 
    expect(user).not.toBeNull()
    //This saves the user to the database

    //Fetching the response body. Useful when writing test cases that the response body matches with what you were expecting
    expect(response.body).toMatchObject({
        user: {
            name: "Federico Floresta",
            email: "Federicofloresta@example.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("Red1234!@#")
})

test("Login existing user", async () => {
    const response = await supertest(app)
    .post("/users/login")
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200) // It is written like this because we are login in as a user that exists
    const user = await User.findById(userOneId) //Looking for that specific user in the db
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login nonexisting user", async () => {
    await supertest(app)
    .post("/users/login")
    .send({
        password: "Thisisocol"
    }).expect(400)
})
test("Should not login with invalid login credentials", async () => {
    await supertest(app)
    .post("/users/login")
    .send({
        email: userOne.email.not, 
        password: userOne.password
    }).expect(400)
})
//I made this not sure if this is correct....double check

test("Should get profile", async () => {
    await supertest(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`) //we use set when we are setting headers and the only time we are going to use it is when we are trying to set our autherization header  
        .send()
        .expect(200)
})

test("Should not get profile for unautheticated user", async () => {
    await supertest(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should not delete account for unauthenticated user", async () => {
    await supertest(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should delete account for user", async () => {
    await supertest(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`) //we use set when we are setting headers and the only time we are going to use it is when we are trying to set our autherization header  
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull() //This is used to see if the user actually got deleted
})

test("Should upload avatar image", async () => {
    await supertest(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg") //this will upload the pic to the correct user
        .expect(200)
    const user = await User.findById(userOneId) //See if the binery has been saved
    expect(user.avatar).toEqual(expect.any(Buffer))//This takes in the constructor for any type and its going to check if the things that are compared are indeed the same 
})//If this does not equal then we know that the image has not been uploaded correctly

test("Should update valid user", async () => {
    await supertest(app)//Every time we test our API
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: "Mike"
    })
    .expect(200)
    const user = await User.findById(userOneId)//To verify that the user has been created and is on the db
    expect(user.name).toEqual("Mike")
})

test("Should not update invalid user fields", async () => {
    await supertest(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: "San Diego"
    })
    .expect(400)
})