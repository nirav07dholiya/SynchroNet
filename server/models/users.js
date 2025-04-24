const mongoose = require('mongoose')
const { genSalt, hash } = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    username: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    DP: {
        type: String,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    incomingPending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    outgoingPending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    profileSetUp: {
        type: Boolean,
        default: false,
    },
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
    }],
    idType: {
        type: String,
        default: "public",
    }
})

userSchema.pre("save", async function (next) {
    const user = this;
    if (!this.isModified('password')) return next();
    const salt = await genSalt(10);
    user.password = await hash(user.password, parseInt(salt));
    next();
})

const User = mongoose.model("users", userSchema);

module.exports = User;