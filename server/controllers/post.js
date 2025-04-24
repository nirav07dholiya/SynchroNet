const { renameSync, unlinkSync } = require("fs");
const Posts = require("../models/posts");
// const image = require('../../uploads/posts/')

const addPost = async (req, res) => {
  try {
    // // console.log(req.file);
    if (!req.file) {
      return res.status(400).send("Image is required.");
    }
    // console.log(req.file.originalname);

    // console.log({ recent: req.file });
    let type = "";

    if (req.file.mimetype == "video/mp4") type = "video";
    else type = "image";
    // console.log(req.file.originalname);

    const date = Date.now();
    let fileName = `uploads/posts/` + date + req.file.originalname;
    // console.log(req.file.path);
    // console.log(fileName);
    renameSync(req.file.path, fileName);
    // console.log(type);

    const createUser = await Posts.create({
      userId: req.userId,
      contentUrl: fileName,
      postType: type,
    });

    console.log({ createUser });

    // // console.log({ createUser });
    return res.status(200).json({
      post: {
        id: createUser.id,
        contentUrl: createUser.contentUrl,
        postType: createUser.postType,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const postData = async (req, res) => {
  try {
    const user = await Posts.find({ userId: req.userId })
      .sort({ _id: -1 })
      .limit(1);
    // const user = await Posts.find({ userId: ObjectId('67484a6413f81164e4415c60') }).sort({ createdAt: 1 }).limit(1);
    // // console.log({user});
    await Posts.findByIdAndUpdate(
      user[0].id,
      { caption: req.body.cap, posted: true },
      { new: true, runValidators: true }
    );
    return res.status(200).send("Post successfully.");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const removePost = async (req, res) => {
  try {
    const post = await Posts.find({ userId: req.userId })
      .sort({ _id: -1 })
      .limit(1);
    // console.log(post[0]);
    if (post[0].contentUrl) {
      unlinkSync(post[0].contentUrl);
      const response = await Posts.findByIdAndDelete(post[0].id);
    }

    return res.status(200).json({ MSG: "Remove image." });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Posts.find({ userId: req.userId, posted: true }).sort({
      _id: -1,
    });
    return res.status(200).json({ posts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const deletePost = async (req, res) => {
  try {
    const response = await Posts.findByIdAndDelete(req.body.postId);
    console.log({ response });
    unlinkSync(response.contentUrl);
    return res.status(200).send("Post deleted.");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

const randomPostFetch = async (req, res) => {
  try {
    const response = await Posts.aggregate([
      { $match: { userId: { $exists: true } } },
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);
    return res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server problem.");
  }
};

module.exports = {
  addPost,
  postData,
  removePost,
  getAllPost,
  deletePost,
  randomPostFetch,
};
