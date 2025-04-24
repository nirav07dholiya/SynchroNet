import React, { useEffect, useMemo, useState } from "react";
import Header from "@/assets/Header";
import Navbar from "@/assets/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TbCameraX } from "react-icons/tb";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { AiFillSave, AiOutlineSave } from "react-icons/ai";
import useAppStore from "@/store";
import { apiClient } from "@/lib/api-client";
import Default from "../../assets/images/default-user.png";
import {
  GET_INFO_ROUTE,
  GET_ONE_POST_ROUTE,
  GET_USER_INFO,
  GET_USER_INFO_POST_ROUTE,
  UNSAVE_POST_ROUTE,
} from "@/utils/constant";
import { toast } from "sonner";
import Caption from "@/assets/Caption";
import { io } from "socket.io-client";
import { FcLike } from "react-icons/fc";
import Like from "@/assets/Like";
import Comment from "@/assets/Comment";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const socket = useMemo(
    () =>
      io("ws://localhost:8747", {
        transports: ["websocket", "polling", "flashsocket"],
        withCredentials: true,
      }),
    []
  );

  const { postId, setPostId, userInfo, setOpenPostInfo } = useAppStore();
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [postInfoLength, setPostInfoLength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (param) => {
    // console.log(param);
    try {
      const response = await apiClient.get(GET_USER_INFO_POST_ROUTE, {
        withCredentials: true,
      });
      // console.log({ response });
      if (response.status == 200 && response.data.savedData) {
        setData(response.data.savedData);
        setPostId(response.data.savedId);
        if (param === "unsave") toast.success("Unsave saved.");
      }

      const infoOfUsers = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });
      setUserLikes(infoOfUsers.data.user.likes);
      // console.log(infoOfUsers.data);
      // console.log({ userLikes });
    } catch (error) {
      // console.log({ error });
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
      // console.log({ response });
      if (response.status == 200 && response.data.response) {
        fetchData("unsave");
      }
    } catch (error) {
      // console.log({ error });
    }
  };

  const getUserInfo = () => {
    socket.on("get-user-info", ({ user, postInfo }) => {
      // console.log({ user });
      if (user) setUserLikes(user.likes);
      // console.log({ userLikes });
      setPostInfoLength(postInfo.likes.length);
    });
  };

  const likePost = async (id) => {
    let userId = "";
    if (userInfo.id) userId = userInfo.id;
    else userId = userInfo._id;
    socket.emit("likePost", { postId: id, userId });
    getUserInfo();
  };

  const removeLikePost = async (id) => {
    let userId = "";
    if (userInfo.id) userId = userInfo.id;
    else userId = userInfo._id;
    socket.emit("removeLikePost", { postId: id, userId });
    getUserInfo();
  };

  const openPost = async (id, likes) => {
    // console.log(id);
    const response = await apiClient.post(
      GET_ONE_POST_ROUTE,
      { postId: id },
      {
        withCredentials: true,
      }
    );
    setPostInfoLength(response.data.post.likes.length);
    setOpenPostInfo(likes)
    // console.log({ response });
  };

  const getInfo = async (userId) => {
    try {
      const response = await apiClient.post(
        GET_INFO_ROUTE,
        { userId },
        { withCredentials: true }
      );
      // console.log({ response });
      if (response.status == 200 && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start">
      <Header />
      <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
        <Navbar />
        <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 dark:bg-gray-100/95">
          <div className=" w-[100vw] md:w-[60vw] lg:w-[35vw] h-full bg-black dark:bg-white">
            <div className="w-full h-auto flex-col flex items-center justify-center border-t-[.5px] border-gray-500/40">
              <div className="w-full h-10 text-white flex items-center justify-start px-3 gap-3 dark:text-black border-b-[1px] border-gray-400/40 md:hidden">
              <FaArrowLeftLong size={25} className="cursor-pointer" onClick={()=>navigate('/profile')}/>
              <p className="text-xl font-bold ">Saved</p>
              </div>
              <ScrollArea className="w-full h-[86vh] md:h-[90vh] p-2">
                <div className="w-full grid grid-cols-3 gap-1 h-full">
                  {data == "" ? (
                    <>
                      <div className=" lg:w-[35vw] md:w-[60vw] h-[85vh] w-[100vw] flex flex-col justify-center items-center text-white/80 dark:text-black/80 ">
                        <TbCameraX className="text-[100px]" />
                        <h1 className="text-xl">No Saved Posts Yet</h1>
                      </div>
                    </>
                  ) : (
                    data.map((onePost) => {
                      return (
                        <>
                          <div className="lg:w-[11.2vw] lg:h-[30vh] cursor-pointer flex justify-center items-center bg-white/5 dark:bg-black/5">
                            <Dialog>
                              <DialogTrigger
                                asChild
                                className="h-[30vh] overflow-hidden"
                                onClick={() => openPost(onePost._id, onePost.likes)}
                              >
                                {onePost.postType == "video" ? (
                                  <video
                                    preload="metadata"
                                    className="w-full object-cover"
                                    onClick={() => getInfo(onePost.userId)}
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
                                    onClick={() => getInfo(onePost.userId)}
                                  />
                                )}
                              </DialogTrigger>
                              <DialogContent className="p-0 bg-black gap-0 m-0 text-white h-auto  border-2 border-gray-400 max-w-[320px] w-full max-h-[90vh]">
                                <div className="w-full h-full bg-black rounded-xl">
                                  <div className="w-full h-12 flex">
                                    <div className="w-[15%] h-full flex items-center justify-center">
                                      <Avatar className="w-7 h-7 ">
                                        <AvatarImage
                                          src={
                                            user.DP
                                              ? `http://localhost:8747/${user.DP}`
                                              : Default
                                          }
                                          alt="profile"
                                          preload="metadata"
                                          className="object-cover w-full h-full bg-black rounded-full"
                                        />
                                      </Avatar>
                                    </div>
                                    <div className="w-[66%] h-full flex justify-start items-center ">
                                      <p className="text-md lowercase">
                                        {user.username}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-auto h-auto relative z-10">
                                    {onePost.postType == "video" ? (
                                      <video
                                        className="max-h-[90vh] w-full"
                                        autoPlay
                                        loop
                                        preload="metadata"
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
                                        className="w-full"
                                        preload="metadata"
                                      />
                                    )}
                                    {onePost.caption && (
                                      <Caption caption={onePost.caption} />
                                    )}
                                  </div>
                                  <div className="w-full h-10 flex items-center justify-between text-2xl rounded-b-xl">
                                    <div className="w-auto h-full px-3 gap-0 flex justify-start items-center">
                                      <div className="w-auto flex items-center justify-center gap-2">
                                        {userLikes.includes(onePost._id) ? (
                                          <FcLike
                                            className="cursor-pointer text-[18px]"
                                            onClick={() =>
                                              removeLikePost(onePost._id)
                                            }
                                          />
                                        ) : (
                                          <FaRegHeart
                                            className="cursor-pointer text-[18px]"
                                            onClick={() =>
                                              likePost(onePost._id)
                                            }
                                          />
                                        )}
                                        <p className="text-[15px] cursor-pointer">
                                          <Like likeLength={postInfoLength} id={onePost._id} />
                                        </p>
                                      </div>
                                      <div className="w-auto flex items-center justify-center gap-2 " >
                                        <Comment id={onePost._id}/>
                                      </div>
                                    </div>
                                    <div className="w-auto h-full px-3 flex items-center justify-center gap-1 text-2xl">
                                      {postId.includes(onePost._id) ? (
                                        <AiFillSave
                                          className="cursor-pointer"
                                          onClick={() =>
                                            unsavePost(onePost._id)
                                          }
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
