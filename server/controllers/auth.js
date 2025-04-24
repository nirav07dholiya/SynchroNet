const User = require("../models/users");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { renameSync, unlinkSync } = require("fs");

const maxAge = 7 * 24 * 60 * 60 * 1000;

const createToken = (email, id) => {
  return sign({ email, id }, process.env.JWT_KEY, { expiresIn: maxAge });
};

const signUp = async (req, res) => {
  try {
    const { email, password, idType } = req.body;
    if (!email || !password)
      return res.status(400).send("Email and Password is required.");
    // console.log(email);
    // console.log(password);

    const user = await User.create({ email, password, idType });
    // console.log(user);
    const cookie = createToken(email, user.id);

    res.cookie("jwt", cookie, {
      maxAge,
      sameSite: "Strict",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profieSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal server problem.");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log({email});
    // console.log({password});
    if (!email || !password)
      return res.status(400).send("Email and Password id required.");

    const user = await User.findOne({ email });
    // console.log({user});
    if (!user) return res.json("error: User doesn't exist.");

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.json({ error: "Password missmatch." });

    const cookie = createToken(email, user.id);
    res.cookie("jwt", cookie, {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        DP: user.DP,
        followers: user.follewers,
        following: user.follewing,
        posts: user.posts,
        profileSetUp: user.profileSetUp,
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send("Internal server problem.");
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send("User is not found.");

    return res.status(200).json({ user });
  } catch (error) {
    // console.log("Error: ", error);
    return res.status(500).send("Internal server problem.");
  }
};

const addProfileImage = async (req, res) => {
  try {
    // console.log(req.file);
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { DP: fileName },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      user: {
        DP: updatedUser.DP,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("User not found.");

    if (user.DP) {
      unlinkSync(user.DP);
    }
    user.DP = null;

    await user.save();

    return res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const setProfile = async (req, res) => {
  try {
    const { username, name, bio } = req.body;
    // console.log({ username });
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, name, bio, profileSetUp: true },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).send("User not found.");
    // console.log({ user });
    return res.status(200).send("Profile updated successfully.");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Log Out successfully.");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const getUserInfoByPostId = async (req, res) => {
  const { postId } = req.body;
  // console.log({ postId });
  const response = await User.find({ likes: postId });
  // console.log({ response });
  return res
    .status(200)
    .json({ response });
};

module.exports = {
  signUp,
  login,
  getUserInfo,
  addProfileImage,
  removeProfileImage,
  setProfile,
  logOut,
  getUserInfoByPostId,
};
