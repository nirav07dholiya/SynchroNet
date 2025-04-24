const { Server } = require("socket.io");
const Posts = require("./models/posts");
const User = require("./models/users");
const { response } = require("express");

const setUpSocket = (server) => {
  // console.log({server});
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

      // console.log({ postId });
      // console.log({ userId });

      const exist = await Posts.find({
        $and: [{ "likes.userId": userId }, { _id: postId }],
      });

      // console.log({ exist });
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
        // console.log({ response });
      }

      const existInMy = await User.find({
        _id: userId,
        likes: postId,
      });

      // console.log({ existInMy });
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
        // console.log({ responseOfMy });
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
      // console.log({ response });

      const responseOfUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            likes: postId
          },
        },
        { new: true, runValidators: true }
      );
      // console.log({ responseOfUser });

      const user = await User.findById(userId)
      const postInfo = await Posts.findById(postId)
      socket.emit('get-user-info', { user, postInfo })

    });

    //send comments
    socket.on("sendComment",async({ postId,comment, userId })=>{
      // console.log({postId});
      // console.log({comment});
      // console.log({userId});
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
      // console.log({postId});
      const response = await Posts.findById(postId).populate("comments.userId")
      // console.log("Populated " + response);
      socket.emit("sendData",{response})  
    })

    socket.on("disconnect", () => {
      // console.log("User disconnected..");
    });
  });
};

module.exports = setUpSocket;
