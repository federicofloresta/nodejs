const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        //This is done only if you want to have a custom validation
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password can not contain 'password'")
            }
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }


    }],
    avatar: {
        type: Buffer //this will allow us to store othe buffer with our binery img data alongside the user who that img belongs to 
    }
}, {
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()


    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}

//Hashed the plain text password before saving
userSchema.pre("save", async function (next) {
    const user = this //this keyword gives us access to that individual user that is about to be saved

    if (user.isModified("password")) { //These three lines will make a password hashed when a user is created and when updating a password. 
        user.password = await bcrypt.hash(user.password, 8) //given a password by plain text
    }

    next()// this is like return; it ends the function
});

//Delete the user tasks when user is removed

userSchema.pre("remove", async function (next) {
    const user = this
    await Task.deleteMany({ owner: user.id })
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User