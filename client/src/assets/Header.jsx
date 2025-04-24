import React, { useEffect, useState } from "react";
import Main from "../assets/images/main.png";
import { FaRegBell } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient } from "@/lib/api-client";
import { CONNECTION_CONFIRM_REQUEST, CONNECTION_DELETE_REQUEST, CONNECTION_FIND_INCOMING_REQUEST } from "@/utils/constant";
import useAppStore from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch"

const Header = ({ onClick }) => {
  const { userInfo,darkMode,setDarkMode } = useAppStore();
  const [requestedData, setRequestedData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await apiClient.post(
        CONNECTION_FIND_INCOMING_REQUEST,
        { userId: userInfo._id },
        { withCredentials: true }
      ); // Replace with your API
      // console.log({ response });
      setRequestedData(response.data.response.incomingPending);
      // console.log({ requestedData });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // console.log("hello");
    fetchData(); // Fetch data immediately when the component mounts

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 5 minutes
    }, 300000); // 300,000ms = 5 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const confirmRequest = async (senderId) => {
    try {
      // console.log({ senderId });
      const confirmResponse = await apiClient.post(CONNECTION_CONFIRM_REQUEST, { userId: userInfo._id, senderId }, { withCredentials: true })
      if (confirmResponse.data.msg == "request accepted" && confirmResponse.status == 200) fetchData();
    } catch (error) {
      console.log({ error });
    }
    onClick()
  }

  const deleteRequest = async (senderId) => {
    try {
      // console.log({ senderId });
      const deleteResponse = await apiClient.post(CONNECTION_DELETE_REQUEST, { userId: userInfo._id, senderId }, { withCredentials: true })
      if (deleteResponse.data.msg == "delete request" && deleteResponse.status == 200) fetchData();
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <>
      <div className= "w-[100vw] h-[8vh] bg-black flex items-center justify-between border-gray-500/50 border-b-2 dark:text-black dark:bg-white/20">
        <img src={Main} className="lg:w-[15%] md:w-[25%] w-[43vw] mt-2 ml-5" />
        <div className="w-auto h-full flex justify-center items-center px-5 text-sm gap-5">
          <div className="flex items-center space-x-2 rounded-xl shadow-md shadow-gray-500 dark:shadow-gray-900  ">
            <Switch onCheckedChange={()=>setDarkMode(!darkMode)} className="dark:bg-white bg-black"/>
          </div>
          <div className="bg-slate-500/20 hover:bg-slate-500/40 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer relative dark:bg-black-300/40">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent outline-none border-none hover:bg-transparent"
                  onClick={() => fetchData()}
                >
                  <FaRegBell className="text-white text-xl dark:text-black" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] h-auto mr-2 mt-4 max-h-[89vh]  bg-black border-gray-400/50 flex flex-col px-2 pt-3 dark:bg-white">
                <ScrollArea className="w-full h-auto flex flex-col items-center justify-center gap-3">
                  {requestedData.map((data) => {
                    return (
                      <div className="w-full h-auto bg-slate-500/30 mb-2 flex items-center gap-1 justify-between px-1 rounded-md">
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
                        <div className="flex w-auto h-full items-center justify-center  text-sm gap-2">
                          <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold border border-blue-700 rounded h-7 px-2" onClick={() => confirmRequest(data._id)}>Confirm</button>
                          <button class="bg-transparent hover:bg-white text-white hover:text-black  border border-white hover:border-transparent rounded h-7 px-2" onClick={() => deleteRequest(data._id)}>Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {requestedData.length > 0 && <div className=" absolute bg-red-500 w-[8px] h-[8px] bottom-[1px] right-[1px] rounded-full"></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
