const { Router } = require('express');
const { signUp, login, getUserInfo, addProfileImage, removeProfileImage, setProfile, logOut, getUserInfoByPostId } = require('../controllers/auth');
const verifyToken = require('../middleware/auth');
const multer = require("multer");
const upload = multer({ dest: "uploads/profiles/" })

const apiRouter = Router();

apiRouter.post("/sign-up", signUp);
apiRouter.post("/login", login);
apiRouter.get("/user-info", verifyToken, getUserInfo);
apiRouter.post("/set-profile", verifyToken, setProfile);
apiRouter.post("/add-profile-image", verifyToken, upload.single('profile-image'), addProfileImage);
apiRouter.delete("/remove-profile-image", verifyToken, removeProfileImage);
apiRouter.post("/logout",logOut);
apiRouter.post("/get-user-info-by-postid", verifyToken, getUserInfoByPostId);


module.exports = apiRouter;