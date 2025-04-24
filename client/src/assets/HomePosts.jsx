import React, { useEffect, useMemo, useState } from "react";
import DefaultImage from "./images/default-user.png";
import Caption from "./Caption";
import { FcLike } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa";
import Comment from "./Comment";
import { AiFillSave, AiOutlineSave } from "react-icons/ai";
import { io } from "socket.io-client";
import useAppStore from "@/store";
import { GET_USER_INFO, GET_USER_INFO_POST_ROUTE, SAVE_POST_ROUTE, UNSAVE_POST_ROUTE } from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import Like from "./Like";
import { useNavigate } from "react-router-dom";

const HomePosts = (props) => {

    const socket = useMemo(
        () =>
            io("ws://localhost:8747", {
                transports: ["websocket", "polling", "flashsocket"],
                withCredentials: true,
            }),
        []
    );

    const { postId, setPostId, userInfo,setSavedData,setOpenIdData } = useAppStore();
    const [userLikes, setUserLikes] = useState([]);
    const [postInfoLength, setPostInfoLength] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        console.log(props.onePost);
        fetchData()
        getUserInfo()
    }, [])
    
    const fetchData = async (param) => {
        console.log(param);
        try {
            const response = await apiClient.get(GET_USER_INFO_POST_ROUTE, {
                withCredentials: true,      
            });
            console.log({ response });
            if (response.status == 200 && response.data.savedData) {
                setPostId(response.data.savedId);
                if (param === "unsave") toast.success("Unsave post.");
                else if (param === "save") toast.success("Save post.");
            }
            setPostInfoLength(props.onePost.likes.length)

            const infoOfUsers = await apiClient.get(GET_USER_INFO, {
                withCredentials: true,
            });
            setUserLikes(infoOfUsers.data.user.likes);
            console.log(infoOfUsers.data);
            console.log({ userLikes });
        } catch (error) {
            console.log({ error });
        }
    };


    const getUserInfo = () => {
        socket.on("get-user-info", ({ user, postInfo }) => {
            console.log({ user });
            if (user) setUserLikes(user.likes);
            console.log({ userLikes });
            setPostInfoLength(postInfo.likes.length);
        });
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

    const clickOnId = (data) => {
        console.log({ data });
        setOpenIdData(data);
        navigate('/open-id');
      }

    return (
        <>
            <div className="w-full h-auto text-white bg-gray-900/50 flex flex-col dark:bg-white dark:text-black ">
                {/* top area */}
                <div className="w-full rounded-md h-12 bg-gray-200/5 flex gap-1 px-2 dark:bg-gray-200">
                    {/* DP  */}
                    <div className="w-11 h-full flex items-center justify-center cursor-pointer" onClick={() => clickOnId(props.onePost.user)}>
                        <img
                            src={`http://localhost:8747/${props.onePost.user.DP}`}
                            alt={DefaultImage}
                            className="rounded-full w-[40px] h-[40px]"
                        />
                    </div>

                    {/* post user details  */}
                    <div className="w-[80%] h-full border-l-[1px] border-gray-50/20 dark:border-black/15  flex flex-col gap-0 items-center justify-center px-3" >
                        <div className="w-full h-[60%] text-[17px] flex items-center justify-start  font-bold cursor-pointer" onClick={() => clickOnId(props.onePost.user)}>
                            {props.onePost.user.username}
                        </div>
                        <div className="w-full h-[40%] text-[8px] flex items-start justify-start cursor-pointer" onClick={() => clickOnId(props.onePost.user)}>
                            {props.onePost.user.name}
                        </div>
                    </div>

                    {/* functionalities */}
                    <div className="w-[10%] h-full bg-yellow-300/0"></div>
                </div>

                {/* middle area  */}
                <div className="w-full h-auto flex items-center justify-center relative">
                    {props.onePost.postType == "video" ? (
                        <video preload="metadata" className="w-full object-cover max-w-[80%]" autoPlay
                            loop muted >
                            <source
                                src={`http://localhost:8747/${props.onePost.contentUrl}`}
                                type="video/mp4"
                            />
                        </video>
                    ) : (
                        <img
                            src={`http://localhost:8747/${props.onePost.contentUrl}`}
                            preload="metadata"
                            className="max-w-[90%]"
                        />
                    )}
                    {props.onePost.caption && (
                        <Caption caption={props.onePost.caption} />
                    )}
                </div>

                {/* bottom area */}
                <div className="w-full h-10 bg-gray-100/5 dark:bg-gray-200 flex gap-1 px-2 mb-3 items-center justify-between rounded-md">
                    <div className="w-auto h-full px-3 flex justify-start items-center ">
                        <div className="w-auto flex items-center justify-center gap-2 ">
                            {userLikes.includes(props.onePost._id) ? (
                                <FcLike
                                    className="cursor-pointer text-[20px]"
                                    onClick={() =>
                                        removeLikePost(props.onePost._id)
                                    }
                                />
                            ) : (
                                <FaRegHeart
                                    className="cursor-pointer text-[20px]"
                                    onClick={() =>
                                        likePost(props.onePost._id)
                                    }
                                />
                            )}
                            <p className="text-[15px] cursor-pointer bg-transparent">
                                <Like likeLength={postInfoLength} id={props.onePost._id} />
                            </p>
                        </div>
                        <div className="w-auto flex items-center justify-center gap-2 " >
                            <Comment id={props.onePost._id} />
                        </div>
                    </div>
                    <div className="w-auto h-full px-3 flex items-center justify-center gap-1 text-2xl">
                        {postId.includes(props.onePost._id) ? (
                            <AiFillSave
                                className="cursor-pointer"
                                onClick={() =>
                                    unsavePost(props.onePost._id)
                                }
                            />
                        ) : (
                            <AiOutlineSave
                                className="cursor-pointer"
                                onClick={() =>
                                    savePost(props.onePost._id)
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePosts;
