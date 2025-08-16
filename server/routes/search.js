const { Router } = require('express');
const verifyToken = require('../middleware/auth');
const { searchData, getPost, getOnePost } = require('../controllers/search');
// const multer = require("multer");
// const upload = multer({ dest: "uploads/posts/" });

const searchRouter = Router();


searchRouter.post('/search-data',verifyToken, searchData)
searchRouter.post('/get-posts',verifyToken, getPost)
searchRouter.post('/get-one-post',verifyToken, getOnePost)

module.exports = searchRouter;