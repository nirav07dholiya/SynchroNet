const { Server } = require("socket.io");
const Posts = require("./models/posts");
const User = require("./models/users");
const { response } = require("express");

const setUpSocket = (server) => {
  const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {

    //like
    socket.on("likePost", async ({ postId, userId }) => {

      const exist = await Posts.find({
        $and: [{ "likes.userId": userId }, { _id: postId }],
      });

      if (!exist[0]) {
        const response = await Posts.findByIdAndUpdate(
          postId,
          {
            $push: {
              likes: {
                userId: userId,
              },
            },
          },
          { new: true, runValidators: true }
        );
      }

      const existInMy = await User.find({
        _id: userId,
        likes: postId,
      });

      if (!existInMy[0]) {
        const responseOfMy = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              likes: postId,
            },
          },
          { new: true, runValidators: true }
        );
      }

      const user = await User.findById(userId)
      const postInfo = await Posts.findById(postId)
      socket.emit('get-user-info', { user, postInfo })

    });

    //remove like
    socket.on("removeLikePost", async ({ postId, userId }) => {
      const response = await Posts.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: {
              userId: userId,
            },
          },
        },
        { new: true, runValidators: true }
      );

      const responseOfUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            likes: postId
          },
        },
        { new: true, runValidators: true }
      );

      const user = await User.findById(userId)
      const postInfo = await Posts.findById(postId)
      socket.emit('get-user-info', { user, postInfo })

    });

    //send comments
    socket.on("sendComment",async({ postId,comment, userId })=>{
      const response = await Posts.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: {
              userId: userId,
              content: comment
            },
          },
        },
        { new: true, runValidators: true }
      )
    })

    //fetch comments
    socket.on("fetchComments",async({postId})=>{
      const response = await Posts.findById(postId).populate("comments.userId")
      socket.emit("sendData",{response})  
    })

    socket.on("disconnect", () => {
      console.log("User disconnected..");
    });
  });
};

module.exports = setUpSocket;
