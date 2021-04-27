const supertest = require("supertest");
const { request } = require("express");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
    userOne,
    userOneId,
    setUpDatabase,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
 } = require("./features/db");


//This will delete the database before the test will run
beforeEach(setUpDatabase);

test("Should task be created for a user", async () => {//This will make a task
    const response = await supertest(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`) //we use set when we are setting headers and the only time we are going to use it is when we are trying to set our autherization header
        .send({
            description: "From my test"
        })
        .expect(201)
    const task = await Task.findById(response.body._id) //verify that its been created on the db
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test("Get tasks by individual user", async () => { // This will fetch that task for that individual user
    const response = await supertest(app) //Making that request
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`) 
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test("Should tasks by individual user be deleted", async () => { //This will delete that task that was fetched from the previous request
    const response = await supertest(app) 
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`) 
        .send()
        .expect(404)
        const task = Task.findById(taskOne._id)
        expect(task).not.toBeNull() 
})
