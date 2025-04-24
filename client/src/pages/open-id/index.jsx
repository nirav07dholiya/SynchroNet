import React, { useEffect, useMemo, useState } from "react";
import Header from "@/assets/Header";
import Navbar from "@/assets/Navbar";
import useAppStore from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Default from "../../assets/images/default-user.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { AiFillSave } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { TbCameraX } from "react-icons/tb";
import { apiClient } from "@/lib/api-client";
import {
  CONNECTION_FOLLOW,
  CONNECTION_REQUEST_BACK,
  CONNECTION_UNFOLLOW,
  GET_INFO_ROUTE,
  GET_ONE_POST_ROUTE,
  GET_POST_ROUTE,
  GET_USER_INFO,
  SAVE_POST_ROUTE,
  UNSAVE_POST_ROUTE,
} from "@/utils/constant";
import { toast } from "sonner";
import Caption from "@/assets/Caption";
import { io } from "socket.io-client";
import Like from "@/assets/Like";
import Comment from "@/assets/Comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; import { HiOutlineLockClosed } from "react-icons/hi2";
import Followers from "@/assets/Followers";
import Followings from "@/assets/Followings";

const PostArea = ({
  post,
  openPost,
  userLikes,
  likePost,
  removeLikePost,
  postId,
  savePost,
  unsavePost,
  openIdData,
  postInfoLength,
}) => {
  return (
    <ScrollArea className="w-full h-[58vh] p-2">
      <div className="w-full grid grid-cols-3 gap-1">
        {post == "" ? (
          <>
            <div className=" lg:w-[35vw] md:w-[60vw] h-[55vh] w-[100vw] flex flex-col justify-center items-center text-white/80 dark:text-black/80">
              <TbCameraX className="text-[70px]" />
              <h1>No Posts Yet</h1>
            </div>
          </>
        ) : (
          post.map((onePost) => {
            return (
              <>
                <div className="lg:w-[11.2vw] lg:h-[30vh] cursor-pointer flex justify-center items-center overflow-hidden bg-white/5 dark:bg-black/5">
                  <Dialog>
                    <DialogTrigger
                      asChild
                      className="h-[32vh]"
                      onClick={() => openPost(onePost._id)}
                    >
                      {onePost.postType == "video" ? (
                        <video
                          preload="metadata"
                          className="w-full object-cover"
                        >
                          <source
                            src={`http://localhost:8747/${onePost.contentUrl}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          src={`http://localhost:8747/${onePost.contentUrl}`}
                          alt=""
                          className="w-full object-cover h-auto"
                          preload="metadata"
                        />
                      )}
                    </DialogTrigger>
                    <DialogContent className=" p-0 bg-black rounded-md gap-0 m-0 text-white h-auto border-2 border-gray-400 sm:max-w-[320px] w-full max-h-[90vh]">
                      <div className="w-full h-full bg-black rounded-md">
                        <div className="w-full h-12 flex">
                          <div className="w-[15%] h-full flex items-center justify-center">
                            <Avatar className="w-7 h-7 ">
                              <AvatarImage
                                src={`http://localhost:8747/${openIdData.DP}`}
                                alt="profile"
                                className=" w-full h-full bg-black"
                              />
                            </Avatar>
                          </div>
                          <div className="w-[66%] h-full flex justify-start items-center ">
                            <p className="text-md">{openIdData.username}</p>
                          </div>
                        </div>
                        <div className="w-full h-auto relative z-10">
                          <DialogTrigger asChild>
                            {onePost.postType == "video" ? (
                              <video
                                autoPlay
                                loop
                                preload="metadata"
                                className="w-full object-cover"
                              >
                                <source
                                  src={`http://localhost:8747/${onePost.contentUrl}`}
                                  type="video/mp4"
                                />
                              </video>
                            ) : (
                              <img
                                src={`http://localhost:8747/${onePost.contentUrl}`}
                                alt=""
                                className="w-full object-cover h-auto"
                              />
                            )}
                          </DialogTrigger>
                          {onePost.caption && (
                            <Caption caption={onePost.caption} />
                          )}
                        </div>
                        <div className="w-full h-10 flex items-center justify-between text-lg">
                          <div className="w-auto h-full px-3 flex justify-start items-center">
                            <div className="w-auto flex items-center justify-center gap-2">
                              {userLikes.includes(onePost._id) ? (
                                <FcLike
                                  className="cursor-pointer"
                                  onClick={() => removeLikePost(onePost._id)}
                                />
                              ) : (
                                <FaRegHeart
                                  className="cursor-pointer"
                                  onClick={() => likePost(onePost._id)}
                                />
                              )}
                              <p className="text-[15px] cursor-pointer">
                                <Like
                                  likeLength={postInfoLength}
                                  id={onePost._id}
                                />
                              </p>
                            </div>
                            <div className="w-auto flex items-center justify-center gap-2 ">
                              <Comment id={onePost._id} />
                            </div>
                          </div>
                          <div className="w-auto h-full px-3 flex items-center justify-center gap-1 text-2xl">
                            {postId.includes(onePost._id) ? (
                              <AiFillSave
                                className="cursor-pointer"
                                onClick={() => unsavePost(onePost._id)}
                              />
                            ) : (
                              <AiOutlineSave
                                className="cursor-pointer"
                                onClick={() => savePost(onePost._id)}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

const OpenId = () => {
  const socket = io("ws://localhost:8747", {
    transports: ["websocket", "polling", "flashsocket"],
    withCredentials: true,
  });

  const { openIdData, userInfo, setOpenIdData } = useAppStore();
  const [post, setPost] = useState([]);
  const [postId, setPostId] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [userAllData, setUserAllData] = useState([]);
  const [postInfoLength, setPostInfoLength] = useState(0);
  const [followersLength, setFollowersLength] = useState(0);
  const [followingLength, setFollowingLength] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOutgoingPending, setIsOutgoingPending] = useState(false);


  useEffect(() => {
    // console.log({ openIdData });
    setFollowersLength(openIdData.followers.length)
    setFollowingLength(openIdData.following.length)

    const fetchData = async () => {
      const infoOfUsers = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });
      // console.log({ infoOfUsers });
      setUserLikes(infoOfUsers.data.user.likes);
      setUserAllData(infoOfUsers.data.user);
      setIsOutgoingPending(infoOfUsers.data.user.outgoingPending.includes(openIdData._id));
      setIsFollowing(infoOfUsers.data.user.following.includes(openIdData._id));
      // console.log({ isFollowing });
      // console.log({ isOutgoingPending });
      // // console.log(infoOfUsers.data);
      // // console.log({ userLikes });

      const response = await apiClient.post(
        GET_POST_ROUTE,
        { id: openIdData._id },
        { withCredentials: true }
      );
      // // console.log(response.data);
      // setPostInfoLength(response.data.posts.length);
      setPost(response.data.posts.reverse());

      const userId = await apiClient.post(
        GET_INFO_ROUTE,
        { userId: userInfo.id },
        { withCredentials: true }
      );
      // // console.log({userId});
      setPostId(userId.data.user.saved);
    };
    fetchData();

    // console.log(userInfo._id);

    socket.on("connect", () => {
      // console.log("Connection established...");
    });

    return () => {
      socket.off("connect", () => {
        // console.log("disconnected...");
      });
    };
  }, [openIdData]);

  const follow = async () => {
    try {
      const followResponse = await apiClient.post(CONNECTION_FOLLOW, { userId: userAllData._id, openIdUser: openIdData._id, idType: openIdData.idType }, { withCredentials: true })
      // console.log({ followResponse });
      if (followResponse.data.msg == "follow successfully") setIsFollowing(true)
      else if (followResponse.data.msg == "request send successfully") setIsOutgoingPending(true)
      setOpenIdData(followResponse.data.openIdData)
    } catch (error) {
      // console.log({ error });
    }
  }

  const requestBack = async () => {
    try {
      const reqBackResponse = await apiClient.post(CONNECTION_REQUEST_BACK, { userId: userAllData._id, openIdUser: openIdData._id }, { withCredentials: true })
      // console.log({ reqBackResponse });
      if (reqBackResponse.data.msg == "request pull back successfully" && reqBackResponse.status == 200) {
        setIsFollowing(false)
        setIsOutgoingPending(false)
        setOpenIdData(reqBackResponse.data.openIdData)
      }
    } catch (error) {
      // console.log({ error });
    }
  }
  const unfollow = async () => {
    try {
      const unfollowResponse = await apiClient.post(CONNECTION_UNFOLLOW, { userId: userAllData._id, openIdUser: openIdData._id }, { withCredentials: true })
      // console.log({ unfollowResponse });
      if (unfollowResponse.data.msg == "unfollow successfully" && unfollowResponse.status == 200) {
        setIsFollowing(false)
        setIsOutgoingPending(false)
        setOpenIdData(unfollowResponse.data.openIdData)
      }
    } catch (error) {
      // console.log({ error });
    }
  }

  const handleData = (response) => {
    // console.log(response.ids);
    setPostId(response.ids);
  };

  const savePost = async (id) => {
    // console.log(id);
    try {
      const response = await apiClient.post(
        SAVE_POST_ROUTE,
        { id },
        { withCredentials: true }
      );
      if (response.status == 200 && response.data) {
        handleData(response.data);
        toast.success("Post saved.");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const unsavePost = async (id) => {
    // console.log(id);
    try {
      const response = await apiClient.post(
        UNSAVE_POST_ROUTE,
        { id },
        { withCredentials: true }
      );
      if (response.status == 200 && response.data.response) {
        handleData(response.data);
        toast.success("Unsave saved.");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const likePost = async (id) => {
    // console.log("i am click");
    let userId = "";
    if (userInfo.id) userId = userInfo.id;
    else userId = userInfo._id;
    socket.emit("likePost", { postId: id, userId });
    socket.on("get-user-info", ({ user, postInfo }) => {
      // console.log({ user });
      setUserLikes(user.likes);
      setPostInfoLength(postInfo.likes.length);
    });
  };

  const removeLikePost = async (id) => {
    // console.log("i am disclick");
    let userId = "";
    if (userInfo.id) userId = userInfo.id;
    else userId = userInfo._id;
    socket.emit("removeLikePost", { postId: id, userId });
    socket.on("get-user-info", ({ user, postInfo }) => {
      // console.log({ user });
      // console.log({ postInfo });
      setUserLikes(user.likes);
      setPostInfoLength(postInfo.likes.length);
    });
  };

  const openPost = async (id) => {
    // console.log(id);
    const response = await apiClient.post(
      GET_ONE_POST_ROUTE,
      { postId: id },
      {
        withCredentials: true,
      }
    );
    setPostInfoLength(response.data.post.likes.length);
    // console.log({ response });
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start overflow-hidden">
        <Header />
        <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
          <Navbar />
          <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 dark:bg-gray-100/95">
            <div className=" w-[100vw] md:w-[60vw] lg:w-[35vw] h-full bg-black dark:bg-white">
              {/* containt postion */}

              {/* username */}
              <div className="w-full min-h-[6vh] md:min-h-[6vh] flex items-center px-4 md:px-8 lg:px-10 font-bold tracking-wide border-b-2 border-gray-500/30 text-[20px] text-white/80 dark:text-black/80">
                {openIdData.username && openIdData.username.toLowerCase()}
              </div>

              {/* DP and Connections */}
              <div className="w-full h-auto flex items-center justify-center gap-7">
                {/* DP */}
                <div className="w-[25%] h-[15vh] lg:h-[20vh] relative flex items-center justify-center rounded-full">
                  <Avatar className=" h-[90px] w-[90px] lg:h-[110px] lg:w-[110px]">
                    {openIdData.DP ? (
                      <AvatarImage
                        src={`http://localhost:8747/${openIdData.DP}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <AvatarImage
                        src={Default}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    )}
                  </Avatar>
                </div>

                {/* Connections */}
                <div className="w-[58%] h-[14vh] md:h-[15vh] lg:h-[15vh] flex flex-col justify-start items-start text-white/80 gap-[8px] dark:text-black/80">

                  {/* name */}
                  <div className="w-auto h-5 text-sm font-bold text-white/80 dark:text-black/80">
                    {openIdData.name ? (
                      openIdData.name
                    ) : (
                      <p className="text-red-700">Please setup your profile.</p>
                    )}
                  </div>
                  <div className="w-full h-[40%] flex items-start justify-start gap-0">
                    <div className="w-[17vw] h-[6vh] md:w-[10vw] md:h-[5vh] lg:w-[5vw] lg:h-[4vh] flex flex-col">
                      <div className="w-full h-auto flex items-start justify-start text-[18px] font-semibold py-0">
                        {post.length}
                      </div>
                      <div className="w-full h-auto flex items-center justify-start text-[10px] md:text-[12px] font-semibold">
                        posts
                      </div>
                    </div>
                    <div className="w-[19vw] h-[6vh] md:w-[10vw] md:h-[5vh] lg:w-[6.4vw] lg:h-[4vw] flex flex-col">
                    <Followers userId={openIdData._id} followersLength={followersLength} call="open-id"/>
                    </div>
                    <div
                      className="w-[17vw] h-[6vh] md:w-[10vw] md:h-[5vh] lg:w-[5vw] lg:h-[4vw] flex flex-col">
                      <Followings userId={openIdData._id} followingLength={followingLength} call="open-id"/>
                    </div>
                  </div>

                  {/* follow button */}
                  {isFollowing ? (
                    <button class="bg-transparent hover:bg-white text-white font-semibold hover:text-black px-2 border border-white hover:border-transparent rounded mb-1 lg:mb-5 w-full h-7" onClick={() => {
                      unfollow()
                    }}>
                      unfollow
                    </button>
                  ) : isOutgoingPending ? (
                    <button class="bg-transparent hover:bg-white text-white font-semibold hover:text-black px-2 border border-white hover:border-transparent rounded mb-1 lg:mb-5 w-full h-7" onClick={() => {
                      requestBack()
                    }}>
                      requested
                    </button>
                  ) : (
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-2 border border-blue-700 rounded mb-1 lg:mb-5 w-full h-7" onClick={() => {
                      follow()
                    }}>
                      follow
                    </button>
                  )}
                </div>
              </div>



              {/* bio */}
              <div className="h-auto w-full text-white px-10 text-[10px] dark:text-black/80">
                {openIdData.bio && openIdData.bio}
              </div>
              <br />

              {/* <div className='w-full sm:h-[.3px] bg-white/25' ></div> */}

              {/* posts */}
              <div className="w-full h-auto flex items-center justify-center border-t-[.5px] border-gray-500/40">
                {openIdData.idType == "public" ||
                  isFollowing ? (
                  <PostArea
                    post={post}
                    openPost={openPost}
                    userLikes={userLikes}
                    likePost={likePost}
                    removeLikePost={removeLikePost}
                    postId={postId}
                    savePost={savePost}
                    unsavePost={unsavePost}
                    openIdData={openIdData}
                    postInfoLength={postInfoLength}
                  />
                ) : (
                  <div className="w-full h-[58vh] p-2 text-white dark:text-black/80 flex items-center justify-center flex-col gap-2">
                    <HiOutlineLockClosed className="text-[80px]" />
                    <p className="text-lg">This account is private</p>
                    <p className="text-xs text-gray-400">
                      Follow this account to see their photos and videos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenId;
