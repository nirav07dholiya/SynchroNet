const Posts = require("../models/posts");

const fetchRandomNetClips = async (req, res) => {

  // console.log("hello friends");
  try {
    const netClip = await Posts.aggregate([
      { $match: { userId: { $exists: true }, postType: "video" } },
      { $sample: { size: 3 } },
      { $group: { _id: "$userId", videos: { $push: "$$ROOT" } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    return res.status(200).json({ netClip })
  } catch (error) {
    console.log({ error });
  }
};


module.exports = { fetchRandomNetClips }