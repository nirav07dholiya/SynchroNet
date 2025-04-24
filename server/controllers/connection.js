const User = require("../models/users");

const follow = async (req, res) => {
    const { userId, openIdUser, idType } = req.body;
    // console.log({ userId });
    // console.log({ openIdUser });
    // console.log({ idType });
    try {
        if (idType == "public") {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        following: openIdUser,
                    },
                },
                { new: true, runValidators: true }
            );
            const openIdData = await User.findByIdAndUpdate(
                openIdUser,
                {
                    $push: {
                        followers: userId,
                    },
                },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ openIdData, msg: "follow successfully" });
        } else {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        outgoingPending: openIdUser,
                    },
                },
                { new: true, runValidators: true }
            );
            const openIdData = await User.findByIdAndUpdate(
                openIdUser,
                {
                    $push: {
                        incomingPending: userId,
                    },
                },
                { new: true, runValidators: true }
            );
            return res
                .status(200)
                .json({ openIdData, msg: "request send successfully" });
        }
    } catch (error) {
        console.log({ error });
    }
};

const requestBack = async (req, res) => {
    try {
        const { userId, openIdUser } = req.body;
        // console.log({ userId });
        // console.log({ openIdUser });
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    outgoingPending: openIdUser,
                },
            },
            { new: true, runValidators: true }
        );
        const openIdData = await User.findByIdAndUpdate(
            openIdUser,
            {
                $pull: {
                    incomingPending: userId,
                },
            },
            { new: true, runValidators: true }
        );
        return res
            .status(200)
            .json({ openIdData, msg: "request pull back successfully" });
    } catch (error) {
        console.log({ error });
    }
};

const unfollow = async (req, res) => {
    const { userId, openIdUser, idType } = req.body;
    // console.log({ userId });
    // console.log({ openIdUser });
    try {
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    following: openIdUser,
                },
            },
            { new: true, runValidators: true }
        );
        const openIdData = await User.findByIdAndUpdate(
            openIdUser,
            {
                $pull: {
                    followers: userId,
                },
            },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ openIdData, msg: "unfollow successfully" });
    } catch (error) {
        console.log({ error });
    }
};

const findIncomingRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const response = await User.findById(userId).populate("incomingPending");
        // console.log({ response });
        return res.json({ response });
    } catch (error) {
        console.log({ error });
    }
};

const confirmRequest = async (req, res) => {
    try {
        // console.log("hello");
        const { userId, senderId } = req.body;
        // console.log({ userId });
        // console.log({ senderId });
        const response = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    incomingPending: senderId,
                },
                $push: {
                    followers: senderId,
                },
            },
            { new: true, runValidators: true }
        );
         await User.findByIdAndUpdate(
            senderId,
            {
                $pull: {
                    outgoingPending: userId,
                },
                $push: {
                    following: userId,
                },
            },
            { new: true, runValidators: true }
        );
        return res.status(200).json({msg:"request accepted"})
    } catch (error) {
        console.log({ error });
    }
};


const deleteRequest = async(req,res)=>{
    try {
        const {userId, senderId } = req.body;
        // console.log({userId});
        // console.log({senderId});
        await User.findByIdAndUpdate(userId,{
            $pull:{
                incomingPending:senderId
            }
        })
        return res.status(200).json({msg:"delete request"})
    } catch (error) {
        // console.log({error});
    }
}

const fetchFollowings = async(req,res)=>{
    try {
        const {userId} = req.body;
        // console.log({userId});
        const response = await User.findById(userId).populate("following");
        return res.status(200).json({response : response.following})
    } catch (error) {
        console.log({error});
    }
}

const fetchFollowers = async(req,res)=>{
    try {
        const {userId} = req.body;
        // console.log({userId});
        const response = await User.findById(userId).populate("followers");
        return res.status(200).json({response : response.followers})
    } catch (error) {
        console.log({error});
    }
}

const removeFollower = async (req, res) => {
    const { userId, removeUserId } = req.body;
    // console.log({ userId });
    // console.log({ removeUserId });
    try {
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    followers: removeUserId,
                },
            },
            { new: true, runValidators: true }
        );
        await User.findByIdAndUpdate(
            removeUserId,
            {
                $pull: {
                    following: userId,
                },
            },
            { new: true, runValidators: true }
        );
        return res.status(200).json({msg: "remove successfully" });
    } catch (error) {
        console.log({ error });
    }
};

module.exports = {
    follow,
    requestBack,
    unfollow,
    findIncomingRequest,
    confirmRequest,
    deleteRequest,
    fetchFollowings,
    fetchFollowers,
    removeFollower,
};
