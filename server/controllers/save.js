const User = require("../models/users");

const savePost = async (req, res) => {
    try {
        const { id } = req.body;
        const post = await User.find({
            _id: req.userId,
            saved: id,
        });
        if (post[0]) {
            const response = await User.findById(req.userId).populate("saved");
            return res
                .status(200)
                .json({ ids: post[0].saved, response: response.saved });
        } else {
            const ids = await User.findByIdAndUpdate(
                req.userId,
                { $push: { saved: id } },
                { new: true, runValidators: true }
            );
            const response = await User.findById(req.userId).populate("saved");

            return res.status(200).json({ ids: ids.saved, response: response.saved });
        }
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server problem.");
    }
};

const unsavePost = async (req, res) => {
    try {
        const { id } = req.body;

        const ids = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { saved: id } },
            { new: true, runValidators: true }
        );
        const response = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { saved: id } },
            { new: true, runValidators: true }
        ).populate("saved");

        return res.status(200).json({ ids: ids.saved, response: response.saved });
    } catch (error) {
        // console.log({ error });
        return res.status(500).send("Internal server problem.");
    }
};

const getInfo = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        return res.status(200).json({ user });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server problem.");
    }
};

const getUserInfo = async (req, res) => {
    try {
        const userId = await User.findById(req.userId);
        const userData = await User.findById(req.userId).populate("saved");

        return res.status(200).json({
            savedId: userId.saved,
            savedData: userData.saved,
        });
    } catch (error) {
        // console.log("Error: ", error);
        return res.status(500).send("Internal server problem.");
    }
};

module.exports = { savePost, unsavePost, getInfo, getUserInfo };
