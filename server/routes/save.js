const { Router } = require('express');
const verifyToken = require('../middleware/auth');
const { savePost, unsavePost, getInfo, getUserInfo } = require('../controllers/save');

const saveRouter = Router();

saveRouter.post('/save-post',verifyToken,savePost)
saveRouter.post('/unsave-post',verifyToken,unsavePost)
saveRouter.post('/get-info',verifyToken,getInfo)
saveRouter.get('/get-user-info',verifyToken,getUserInfo)

module.exports = saveRouter