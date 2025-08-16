const { Router } = require('express');
const verifyToken = require('../middleware/auth');
const multer = require("multer");
const { addPost, removePost, postData, getAllPost,deletePost, randomPostFetch } = require('../controllers/post');
const { fetchRandomNetClips } = require('../controllers/net-clips');
const upload = multer({ dest: "uploads/posts/" })


const postRouter = Router();

postRouter.post("/post-upload", verifyToken, upload.single('posts'), addPost);
postRouter.delete("/remove-image", verifyToken, removePost);
postRouter.post("/post-data", verifyToken, postData);
postRouter.get("/get-all-post", verifyToken, getAllPost);
postRouter.delete("/delete-post", deletePost);
postRouter.get("/get-random-posts",verifyToken,randomPostFetch)
postRouter.get("/random-net-clips",verifyToken,fetchRandomNetClips)

module.exports = postRouter;    