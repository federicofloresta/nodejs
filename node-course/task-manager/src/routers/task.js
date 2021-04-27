const express = require("express");
const Task = require("../db/models/task")
const auth = require("../middleware/auth")
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
});

//GET/tasks?completed=true
//GET/tasks?limit=15&skip=0 - first page
//GET/tasks?sort=createdAt:desc
/*Pagination: Idea of creating pages of data that can be requested so that you do not get everything all at once.
If we have 700 true tasks we do not want to have all 700 all at once, we can show 15 or so at once */
/*Limit and skip first will be set for numbers
With this we are having the client the ability to customize the data that is coming back
Slow down the client device, and the server to fetch the data and retrieve it back */
router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}

        if(req.query.completed) {
            match.completed = req.query.completed === "true"
        }
        if (req.query.sort) {
            const parts = req.query.sort.split(":")
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1
        }
    try {
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit), //this will make the user provide the number of tasks that they can see; they have control
                skip: parseInt(req.query.skip), // this will make the user provide the number of tasks that they can see in each page; they have control
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body) //I need to know what is being updated. This converts something from an object to an array of properties 
    const allowedUpdates = ["description", "completed"] //What is allowed to be updated
    const isValidOp = updates.every((item) => allowedUpdates.includes(item)) //If this is valid or not? 

    if (!isValidOp) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
});

module.exports = router;