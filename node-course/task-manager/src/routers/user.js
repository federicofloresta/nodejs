const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../db/models/user")
const auth = require("../middleware/auth")
const { sendWelcomeEmail, sendCancellingEmail } = require("../emails/account");
const router = new express.Router();

router.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()//This generates a token for the user when they first sign up
        res.status(201).send({ user, token }) //This will send back the user and the token to the database
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()

    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
});


router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOp = updates.every((item) => allowedUpdates.includes(item))

    if (!isValidOp) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }

    router.delete("/users/me", auth, async (req, res) => {
        try {
            await req.user.remove()
            sendCancellingEmail(req.user.email, req.user.name)
            res.send(req.user)
        } catch (e) {
            res.status(500).send()
        }
    });

});

const upload = multer({
    limits: {
        fileSize: 1000000 //1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) { //this is how to use regular expressions; which is how to use the "or" , || keyword
            return cb(new Error("Please upload an image"))
        }

        cb(undefined, true)
    }
})
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => { //we added another function to have nice clean JSON error instead of the HTTP that we had previously. This function needs to have this call signature, this set of arguments that is what let express know that this is the function set up to handle any uncaught errors 
    res.status(400).send({ error: error.message })
})

//This please review
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;

//Using the binary data we can render the images in the browser by specifying the URL structure
/* side note: The next step is where exactly are we going to store that image
we are not going to store then in the file system like we have been doing so far,
the reason behind this almost all deployment platforms require you to take your code
and push it to the depository on their servers, we saw this in heroku and the same will be true
if you were to use AWS, so the file system actually gets wiped every time we deploy,
which in return means that we will lose data every time we deploy,
we would lose those users images */