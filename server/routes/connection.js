const { Router } = require('express');
const verifyToken = require('../middleware/auth');
const { follow,requestBack ,unfollow, findIncomingRequest,confirmRequest,deleteRequest, fetchFollowings, fetchFollowers, removeFollower} = require('../controllers/connection');

const connectionRouter = Router();

connectionRouter.post("/follow", verifyToken,follow);
connectionRouter.post("/request-back", verifyToken,requestBack);
connectionRouter.post("/unfollow", verifyToken,unfollow);
connectionRouter.post("/find-incoming-request", verifyToken,findIncomingRequest);
connectionRouter.post("/confirm-request", verifyToken,confirmRequest);
connectionRouter.post("/delete-request", verifyToken,deleteRequest);
connectionRouter.post("/fetch-followers", verifyToken,fetchFollowers);
connectionRouter.post("/fetch-followings", verifyToken,fetchFollowings);
connectionRouter.post("/remove-followers", verifyToken,removeFollower);


module.exports = connectionRouter;