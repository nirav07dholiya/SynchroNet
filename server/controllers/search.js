const Posts = require("../models/posts");
const User = require("../models/users");

const searchData = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (searchTerm == undefined || searchTerm == null) {
            return res.status(400).send("searchTerm is required.");
        }

        const sanitisedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitisedSearchTerm, "i");
        const users = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [{ username: regex }, { name: regex }],
                },
            ],
        });
        return res.status(200).json({ users })

    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server problem.");
    }
}


const getPost = async (req, res) => {
    try {
        const { id } = req.body;
        const posts = await Posts.find({ userId: id, posted:true })

        return res.status(200).json({ posts })
    } catch (error) {
        // console.log({ error });
        return res.status(500).send("Internal server problem.");
    }
}

const getOnePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await Posts.findById(postId)

        return res.status(200).json({ post })
    } catch (error) {
        // console.log({ error });
        return res.status(500).send("Internal server problem.");
    }
}


module.exports = { searchData, getPost ,getOnePost}