import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient } from "@/lib/api-client";
import { CONNECTION_FETCH_FOLLOWERS, CONNECTION_REMOVE_FOLLOWERS } from '@/utils/constant';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAppStore from '@/store';

const Followers = ({ userId, followersLength, call, onClick }) => {

    const{userInfo}=useAppStore()
    const [followersData, setFollowersData] = useState([]);

    const fetchData = async () => {
        try {
            // console.log({ userId });
            const followersResponse = await apiClient.post(
                CONNECTION_FETCH_FOLLOWERS,
                { userId },
                { withCredentials: true }
            );
            // console.log({ followersResponse });
            setFollowersData(followersResponse.data.response)
        } catch (error) {
            console.log({ error });
        }
    };

    const removeFollower = async(removeUserId)=>{
        // console.log({removeUserId});
        // console.log(userInfo._id);
        const removeFollowerResponse = await apiClient.post(CONNECTION_REMOVE_FOLLOWERS,{userId:userInfo._id,removeUserId},{withCredentials:true})
        // console.log({removeFollowerResponse});
        if(removeFollowerResponse.status == 200 && removeFollowerResponse.data.msg == "remove successfully"){
            fetchData();
        }
        onClick();
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-transparent outline-none border-none hover:bg-transparent p-0 h-auto hover:text-white/80 dark:hover:text-black/80  flex flex-col gap-[4px] items-center justify-start"
                        onClick={() => fetchData()}
                    >
                        <div className="w-full h-[60%] pl-[1px] flex items-center justify-start text-[18px] font-semibold">
                            {followersLength}
                        </div>
                        <div className="w-full h-[35%] flex items-center justify-start text-[10px] md:text-[12px]">
                            followers
                        </div>
                    </Button>
                </PopoverTrigger>
                {/* <PopoverContent className="w-[350px] h-auto max-h-[69vh] mr-2 mt-4 lg:max-h-[89vh]  bg-black border-gray-400/50 flex flex-col px-2 pt-3 lg:absolute lg:top-[-20.5vh] lg:left-[-44vw] gap-3"> */}
                <PopoverContent className="w-[350px] h-auto max-h-[69vh] mr-2 mt-4 lg:max-h-[89vh]  bg-black border-gray-400/50 flex flex-col px-2 pt-3 lg:absolute gap-3 lg:top-[-20.5vh] lg:left-[-44vw]">
                    <div className="text-white/80 px-1 font-bold">{followersLength} followers</div>
                    <ScrollArea className="w-full h-suto flex flex-col items-center justify-center gap-3">
                        {followersLength > 0 ? followersData.map((data) => {
                            return (
                                <div className="w-full h-auto bg-slate-500/30 mb-2 flex items-center gap-1 justify-between px-1 rounded-md ">
                                    <div className="w-auto flex items-center justify-center gap-2 px-1">
                                        {/* DP  */}
                                        <div className="w-[35px] h-[35px] flex items-center justify-center">
                                            <img
                                                src={`http://localhost:8747/${data.DP}`}
                                                preload="metadata"
                                                className=" rounded-full w-8 h-8"
                                            />
                                        </div>

                                        {/* details  */}
                                        <div className="w-auto bg-slate-400/05  text-gray-200 h-full px-1 flex flex-col items-start justify-center">
                                            <p className="text-[13px] font-bold">
                                                {data.username}
                                            </p>
                                            <p className="text-[9.9px] text-wrap">
                                                requested to follow you.
                                            </p>
                                        </div>
                                    </div>

                                    {/* connection buttons */}
                                    <div className="flex w-auto mr-2 h-full items-center justify-center  text-sm gap-2">
                                        {
                                            call == "open-id" ? null : <button class="bg-transparent hover:bg-white/80 text-white/80 hover:text-black  border border-white/80 hover:border-transparent rounded h-6 px-2" onClick={() => removeFollower(data._id)}>remove</button>
                                        }

                                    </div>
                                </div>
                            );
                        }) : <p className='text-white/80'>No have any followers</p>
                        }
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default Followers