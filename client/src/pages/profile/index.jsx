import Header from "@/assets/Header";
import Navbar from "@/assets/Navbar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAppStore from "@/store";
import { FaRegHeart } from "react-icons/fa6";
import { TbCameraX, TbLogout2 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import { AiFillSave, AiOutlineSave } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import Default from "../../assets/images/default-user.png";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  DELETE_POST,
  GET_ALL_POST,
  GET_ONE_POST_ROUTE,
  GET_USER_INFO,
  LOGOUT_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  SAVE_POST_ROUTE,
  SET_PROFILE_ROUTE,
  UNSAVE_POST_ROUTE,
} from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import Caption from "@/assets/Caption";
import { FcLike } from "react-icons/fc";
import { io } from "socket.io-client";
import Comment from "@/assets/Comment";
import Like from "@/assets/Like";
import Followings from "@/assets/Followings";
import Followers from "@/assets/Followers";

const Profile = () => {
  const socket = useMemo(() => io("ws://localhost:8747", {
    transports: ["websocket", "polling", "flashsocket"],
    withCredentials: true,
  }), [])

  const {
    userInfo,
    setUserInfo,
    setUserAllPost,
    setSavedData,
    postId,
    setPostId,
  } = useAppStore();
  const inputeImageRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [DP, setDP] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [post, setPost] = useState("");
  const [userLikes, setUserLikes] = useState([]);
  const [postInfoLength, setPostInfoLength] = useState(0);
  const [followersLength, setFollowersLength] = useState(0);
  const [followingLength, setFollowingLength] = useState(0);
  const navigate = useNavigate();

  const fetchPost = async () => {
    const response = await apiClient.get(GET_ALL_POST, {
      withCredentials: true,
    });
    console.log(response.data.posts);
    if (response.status == 200 && response.data.posts) {
      setUserAllPost(response.data.posts);
      setPost(response.data.posts);
    }

    const infoOfUsers = await apiClient.get(
      GET_USER_INFO,
      { withCredentials: true }
    );
    setUserLikes(infoOfUsers.data.user.likes)
    setFollowersLength(infoOfUsers.data.user.followers.length)
    setFollowingLength(infoOfUsers.data.user.following.length)
    setUserInfo(infoOfUsers.data.user)
    console.log(infoOfUsers.data);
    console.log({ userLikes });
  };

  useEffect(() => {
    console.log({ userInfo });
    fetchPost();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status == 200 && response.data.user) {
        setUsername(response.data.user.username);
        setName(response.data.user.name);
        setBio(response.data.user.bio);
      }
    };
    fetchData();
    if (userInfo.DP) setDP(`http://localhost:8747/${userInfo.DP}`);
  }, [userInfo, setUserInfo]);

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status == 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleData = (response) => {
    console.log(response.ids);
    setPostId(response.ids);
    console.log(response.response);
    setSavedData(response.response);
  };

  const savePost = async (id) => {
    console.log(id);
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
    console.log(id);
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
    console.log("i am click");
    let userId = "";
    if (userInfo.id) userId = userInfo.id;
    else userId = userInfo._id;
    socket.emit("likePost", { postId: id, userId });
    socket.on("get-user-info", ({ user, postInfo }) => {
      console.log({ user });
      if (user) setUserLikes(user.likes);
      setPostInfoLength(postInfo.likes.length)
    });
  };

  const removeLikePost = async (id) => {
    console.log("i am disclick");
    let userId = "";
    if (userInfo.id) userId = userInfo.id;
    else userId = userInfo._id;
    socket.emit("removeLikePost", { postId: id, userId });
    socket.on("get-user-info", ({ user, postInfo }) => {
      console.log({ user });
      console.log({ postInfo });
      if (user) setUserLikes(user.likes);
      setPostInfoLength(postInfo.likes.length)
    });
  };

  const openPost = async (id) => {
    console.log(id);
    const response = await apiClient.post(GET_ONE_POST_ROUTE, { postId: id }, {
      withCredentials: true,
    })
    setPostInfoLength(response.data.post.likes.length)
    console.log({ response });
  }


  // db.users.updateOne({ _id: ObjectId('6787b03eb3ff2fe0c9085845') }, { $set: { saved: [] } });

  const handleImageInputClick = () => {
    inputeImageRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      console.log(formData);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status == 200 && response.data.user.DP) {
        setUserInfo({ ...userInfo, DP: response.data.user.DP });
        toast.success("Image updated successfully.");
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      console.log({ response: response });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, DP: null });
        toast.success("Image removed successfully.");
        setDP(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveChanges = async () => {
    if (!username || !name) {
      toast.error("Username and Name is required.");
      return false;
    }
    const data = { username, name, bio };
    console.log({ data });
    const response = await apiClient.post(SET_PROFILE_ROUTE, data, {
      withCredentials: true,
    });
    if (response.status == 200) {
      setUserInfo({
        ...userInfo,
        username: username,
        name: name,
        profileSetUp: true,
      });
      toast.success("Profile updated successfully.");
    }
    console.log({ userInfo });
  };

  const deletePost = async (id) => {
    let postId = id;
    const response = await apiClient.delete(
      DELETE_POST,
      { data: { postId } },
      { withCredentials: true }
    );
    if (response.status == 200) {
      toast.success("Post delete successfully.");
      // navigate('/profile')
      window.location.reload(false);
    }
  };



  return (
    <>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start">
        <Header onClick={fetchPost} />
        <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
          <Navbar />
          <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 dark:bg-gray-100/95">
            <div className=" w-[100vw] md:w-[60vw] lg:w-[35vw] h-full bg-black dark:bg-white flex flex-col gap-1 overflow-hidden">
              {/* containt postion */}

              {/* username */}
              <div className="w-full min-h-[6vh] md:min-h-[6vh] flex items-center px-4 md:px-8 lg:px-10 font-bold tracking-wide border-b-2 border-gray-500/30 text-[20px] text-white/80 dark:text-black/80 md:justify-start justify-between">
                <div className="">{username && username.toLowerCase()}</div>
                <div className="flex items-center justify-center">
                  <div
                    className="flex items-center justify-center w-10 cursor-pointer h-10 rounded-md hover:bg-gray-500/25 md:hidden dark:text-black/70"
                    onClick={()=>navigate('/saved')}
                  >
                    <AiOutlineSave className="text-[25px] md:text-[22px]" />
                  </div>
                  <div
                    className="flex items-center justify-center w-10 cursor-pointer h-10 rounded-md hover:bg-gray-500/25 md:hidden dark:text-black/70"
                    onClick={logOut}
                  >
                    <TbLogout2 className="text-[25px] md:text-[22px]" />
                  </div>

                </div>
              </div> 

              {/* DP and Connections */}
              <div className="w-full h-auto flex items-center justify-center gap-7">
                {/* DP */}
                <div
                  className="w-[25%] h-[15vh] lg:h-[20vh] relative flex items-center justify-center rounded-full"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Avatar className=" h-[90px] w-[90px] lg:h-[110px] lg:w-[110px]">
                    {DP ? (
                      <AvatarImage
                        src={DP}
                        alt="profile"
                        className="object-cover w-full h-full bg-black  dark:bg-white/70"
                      />
                    ) : (
                      <AvatarImage
                        src={Default}
                        alt="profile"
                        className="object-cover w-full h-full bg-black dark:bg-white/70"
                      />
                    )}
                  </Avatar>
                  {hovered && (
                    <div
                      className="absolute w-full h-full inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer dark:bg-transparent"
                      onClick={DP ? handleImageDelete : handleImageInputClick}
                    >
                      {DP ? (
                        <FaTrash className="text-white text-3xl cursor-pointer " />
                      ) : (
                        <FaPlus className="text-white text-3xl cursor-pointer " />
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={inputeImageRef}
                    className="hidden"
                    onChange={handleImageChange}
                    name="image-profile"
                    accept=".png, .jpg, .jpeg, .svg, .webp"
                  />
                </div>

                {/* Connections */}
                <div className="w-[58%] h-[14vh] md:h-[15vh] lg:h-[15vh] flex flex-col justify-start items-start text-white/80 gap-[8px]">

                  {/* name */}
                  <div className="w-auto h-5 text-sm font-bold text-white/80 dark:text-black/80">
                    {name ? (
                      name
                    ) : (
                      <p className="text-red-700">Please setup your profile.</p>
                    )}
                  </div>
                  <div className="w-full h-[40%] flex items-start justify-start gap-0 dark:text-black/80">
                    <div className="w-[17vw] h-[6vh] md:w-[10vw] md:h-[5vh] lg:w-[5vw] lg:h-[4vh] flex flex-col">
                      <div className="w-full h-auto flex items-start justify-start text-[18px] font-semibold py-0">
                        {post.length}
                      </div>
                      <div className="w-full h-auto flex items-center justify-start text-[10px] md:text-[12px] font-semibold">
                        posts
                      </div>
                    </div>
                    <div className="w-[19vw] h-[6vh] md:w-[10vw] md:h-[5vh] lg:w-[6.4vw] lg:h-[4vw] flex flex-col">
                      <Followers userId={userInfo._id} followersLength={followersLength} onClick={fetchPost} />

                    </div>
                    <div
                      className="w-[17vw] h-[6vh] md:w-[10vw] md:h-[5vh] lg:w-[5vw] lg:h-[4vw] flex flex-col">
                      <Followings userId={userInfo._id} followingLength={followingLength} onClick={fetchPost} />
                    </div>
                  </div>
                  <div className="w-full h-[25%] flex items-center justify-center ">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-black h-7 "
                        >
                          Setup Profile{" "}
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-black text-white dark:bg-white dark:text-black">
                        <SheetHeader className="dark:bg-white">
                          <SheetTitle className="text-white dark:text-black">
                            Edit profile
                          </SheetTitle>
                          <SheetDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4 w-full">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="username" className="text-right">
                              Username
                            </label>
                            <Input
                              id="username"
                              value={username}
                              placeholder="username"
                              className="col-span-3 bg-gray-900 outline-none "
                              maxLength="15"
                              minLength="3"
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                              Name
                            </label>
                            <Input
                              id="name"
                              placeholder="name"
                              maxLength="15"
                              minLength="3"
                              value={name}
                              className="col-span-3 bg-gray-900 outline-none "
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="bio" className="text-right">
                              Bio
                            </label>
                            <Textarea
                              id="bio"
                              value={bio}
                              placeholder="bio"
                              className="col-span-3 bg-gray-900 outline-none"
                              maxLength="15"
                              minLength="5"
                              onChange={(e) => setBio(e.target.value)}
                            />
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button type="submit" onClick={saveChanges}>
                              Save changes
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              {/* bio */}
              <div className="h-auto w-full text-white px-10 text-[10px]">
                {bio && bio}
              </div>
              <br />

              {/* <div className='w-full sm:h-[.3px] bg-white/25' ></div> */}

              {/* posts */}
              <div className="w-full h-auto flex items-center justify-center border-t-[.5px] border-gray-500/40">
                <ScrollArea className="w-full h-[58vh] p-2">
                  <div className="w-full grid grid-cols-3 gap-1 ">
                    {post == "" ? (
                      <>
                        <div className=" lg:w-[35vw] md:w-[60vw] h-[55vh] w-[100vw] flex flex-col justify-center items-center text-white/80">
                          <TbCameraX className="text-[70px]" />
                          <h1>No Posts Yet</h1>
                        </div>
                      </>
                    ) : (
                      post.map((onePost) => {
                        return (
                          <>
                            <div className=" lg:w-[11.2vw] h-[30vh] cursor-pointer flex justify-center items-center overflow-hidden bg-white/5 dark:bg-black/5">
                              <Dialog>
                                <DialogTrigger asChild onClick={() => openPost(onePost._id)}>
                                  {onePost.postType == "video" ? (
                                    <video
                                      className="object-fill w-auto h-full md:h-auto"
                                      preload="metadata"
                                    >
                                      <source src={`http://localhost:8747/${onePost.contentUrl}`} type="video/mp4" />
                                    </video>
                                  ) : (
                                    <img
                                      src={`http://localhost:8747/${onePost.contentUrl}`}
                                      alt=""
                                      className="object-fill w-full h-auto md:h-auto"
                                    />
                                  )}
                                </DialogTrigger>
                                <DialogContent className="p-0 bg-black gap-0 m-0 text-white h-auto border-2 border-gray-400 max-w-[300px] w-full max-h-[90vh] rounded-md">
                                  <div className="w-full h-full bg-black rounded-xl">
                                    <div className="w-full h-12 flex">
                                      <div className="w-[15%] h-full flex items-center justify-center">
                                        <Avatar className="w-7 h-7 ">
                                          <AvatarImage
                                            src={DP}
                                            alt="profile"
                                            className="object-cover w-full h-full bg-black"
                                          />
                                        </Avatar>
                                      </div>
                                      <div className="w-[62%] h-full flex justify-start items-center ">
                                        <p className="text-md">{username}</p>
                                      </div>
                                      <button
                                        className="w-auto h-full flex justify-start items-center text-lg cursor-pointer"
                                        onClick={() => deletePost(onePost._id)}
                                      >
                                        <MdDelete className="text-white/70 hover:text-white/90 w-10" />
                                      </button>
                                    </div>
                                    <div className="w-full h-auto relative z-10">
                                      {onePost.postType == "video" ? (
                                        <video
                                          className="max-h-[90vh] w-full"
                                          preload="metadata"
                                          autoPlay
                                          loop
                                        >
                                          <source src={`http://localhost:8747/${onePost.contentUrl}`} type="video/mp4" />
                                        </video>
                                      ) : (
                                        <img
                                          src={`http://localhost:8747/${onePost.contentUrl}`}
                                          alt=""
                                          className="w-full"
                                        />
                                      )}
                                      {onePost.caption && (
                                        <Caption caption={onePost.caption} />
                                      )}
                                    </div>
                                    <div className="w-full h-10 flex items-center justify-between ">
                                      <div className="w-auto h-full px-3 flex justify-start items-center">
                                        <div className="w-auto flex items-center justify-center gap-2">
                                          {userLikes.includes(onePost._id) ? (
                                            <FcLike
                                              className="cursor-pointer text-[20px]"
                                              onClick={() =>
                                                removeLikePost(onePost._id)
                                              }
                                            />
                                          ) : (
                                            <FaRegHeart
                                              className="cursor-pointer text-[20px]"
                                              onClick={() =>
                                                likePost(onePost._id)
                                              }
                                            />
                                          )}
                                          <p className="text-[15px] cursor-pointer"><Like likeLength={postInfoLength} id={onePost._id} /></p>
                                        </div>
                                        <div className="w-auto flex items-center justify-center gap-2 " >
                                          <Comment id={onePost._id} />
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
                                            onClick={() =>
                                              savePost(onePost._id)
                                            }
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
    </>
  );
};

export default Profile;
