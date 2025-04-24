const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    contentUrl: {
        type: String,
    },
    caption: {
        type: String,
    },
    postType:{
        type:String,
        required:true,
    },
    likes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
            content: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    posted:{
        type:Boolean,   
        default:false,
    },
});

const Posts = mongoose.model("posts",postSchema)

module.exports = Posts