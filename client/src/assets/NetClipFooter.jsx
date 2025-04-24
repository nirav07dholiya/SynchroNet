import React, { useEffect, useMemo, useState } from 'react'
import { AiFillSave, AiOutlineSave } from 'react-icons/ai';
import Like from './Like';
import { FaRegHeart } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import useAppStore from '@/store';
import Comment from './Comment';
import { io } from 'socket.io-client';
import { apiClient } from '@/lib/api-client';
import { SAVE_POST_ROUTE, UNSAVE_POST_ROUTE } from '@/utils/constant';
import { toast } from 'sonner';

const NetClipFooter = ({ userData, video }) => {

    const socket = useMemo(
        () =>
            io("ws://localhost:8747", {
                transports: ["websocket", "polling", "flashsocket"],
                withCredentials: true,
            }),
        []
    );

    const { userInfo, setUserInfo } = useAppStore()
    const [videoLikes, setVideoLikes] = useState([])
    const [videoLikesLength, setVideoLikesLength] = useState(0)
    const [videoSaved, setVideoSaved] = useState([])

    useEffect(() => {
        // // console.log({ userData });
        // // console.log({ video });
        const likes = video.likes.map(item => item.userId);
        setVideoLikes(likes)
        setVideoSaved(userInfo.saved)
        // // console.log({videoLikes});
        setVideoLikesLength(video.likes.length);
    }, [])

    const handleData = (response) => {
        // console.log({response});
        setVideoSaved(response.ids);
    };

    const savePost = async (id) => {
        // console.log(id);
        // console.log({ userInfo });
        try {
            const response = await apiClient.post(
                SAVE_POST_ROUTE,
                { id },
                { withCredentials: true }
            );
            // console.log({ response });
            if (response.status == 200 && response.data) {
                handleData(response.data);
                toast.success("Post saved.");
            }
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
            if (response.status == 200 && response.data.response) {
                handleData(response.data);
                toast.success("Unsave saved.");
            }
        } catch (error) {
            console.log({ error });
        }
    };

    const getUserInfo = () => {
        socket.on("get-user-info", ({ user, postInfo }) => {
            // // console.log({ postInfo });
            const likes = postInfo.likes.map(item => item.userId);
            // // console.log({likes});
            setVideoLikes(likes);
            setVideoLikesLength(postInfo.likes.length);
            // // console.log(videoLikes);
        });
    };

    const likePost = async (id) => {
        // console.log("like post");
        // console.log({ video });
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

    return (
        <div className='absolute bottom-0 text-white h-[40vh] w-full flex items-end'>
            <div className="w-[90%] h-[50%] ">
                <div className="w-full h-[40%] flex items-center justify-start">
                    <div className="w-[60px] h-full flex items-center justify-center">
                        <img src={`http://localhost:8747/${userData.DP}`} alt="" className='rounded-full h-[70%] w-[67%]' />
                    </div>
                    <div className="w-auto h-full ">
                        <div className="w-auto h-full flex flex-col items-start justify-center">
                            <p className='text-lg'>{userData.username}</p>
                            <p className='text-[10px]'>{userData.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[70px] h-[80%] flex flex-col gap-1">
                <div className="w-full h-[70px] ">
                    <div className="w-auto flex items-center justify-center flex-col relative ">
                        {videoLikes.includes(userInfo._id) ? (
                            <FcLike
                                className="cursor-pointer text-[27px] p-0 m-0 absolute top-3"
                                onClick={() =>
                                    removeLikePost(video._id)
                                }
                            />
                        ) : (
                            <FaRegHeart
                                className="cursor-pointer text-[22px] p-0 m-0 absolute top-4"
                                onClick={() =>
                                    likePost(video._id)
                                }
                            />
                        )}
                        <Like likeLength={videoLikesLength} id={video._id} call="NetClipFooter"/>
                    </div>
                </div>
                <div className="w-full h-[70px]">
                    <div className="w-auto flex items-center justify-center gap-2 " >
                        <Comment id={video._id} call="NetClipFooter"/>
                    </div>
                </div>
                <div className="w-full h-[70px]">
                    <div className="w-auto h-full px-3 flex items-center justify-center gap-1 text-2xl">
                        {videoSaved.length > 0 && videoSaved.includes(video._id) ? (
                            <AiFillSave
                                className="cursor-pointer"
                                onClick={() =>
                                    unsavePost(video._id)
                                }
                            />
                        ) : (
                            <AiOutlineSave
                                className="cursor-pointer"
                                onClick={() =>
                                    savePost(video._id)
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NetClipFooter