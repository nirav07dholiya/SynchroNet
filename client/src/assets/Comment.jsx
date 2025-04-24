import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAppStore from "@/store";
import { FaRegComment } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO_BY_POSTID } from "@/utils/constant";
import { useEffect, useMemo, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
import Default from "../assets/images/default-user.png"
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Comment = (props) => {
  const socket = useMemo(
    () =>
      io("ws://localhost:8747", {
        transports: ["websocket", "polling", "flashsocket"],
        withCredentials: true,
      }),
    []
  );

  const { setOpenIdData, openIdData, userInfo } = useAppStore();
  const [comment, setComment] = useState("");
  const [allCommentsData, setAllCommentsData] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchComments()
  }, []);

  const fetchComments = () => {
    socket.emit("fetchComments", { postId: props.id })
    socket.on("sendData", ({ response }) => {
      // console.log(response.comments);
      setAllCommentsData(response.comments)
    })
  }

  const sendComment = () => {
    socket.emit("sendComment", {
      postId: props.id,
      comment,
      userId: userInfo._id,
    });
    fetchComments()
    setComment("")
  };

  const clickOnId = (data) => {
    // console.log({ data });
    setOpenIdData(data.userId);
    navigate('/open-id');
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className={`${props.call == "NetClipFooter" && "flex-col"} w-full h-full flex items-center justify-center bg-transparent hover:bg-transparent border-none text-white hover:text-white`}
          onClick={fetchComments}
        >
          <FaRegComment className={`${props.call == "NetClipFooter" ? "!w-6 !h-6" : "!w-5 !h-5"} text-white`} />


          {allCommentsData.length > 0 && <p className="text-[16px]">{allCommentsData.length}</p>}

        </Button>
      </HoverCardTrigger>


      <HoverCardContent className="w-80 bg-black/80 p-2">
        <ScrollArea className="w-full h-[190px] flex flex-col items-center justify-center ">
          {allCommentsData.map((data) => {
            return data.content && (
              <>
                <div
                  className="w-full h-12 bg-gray-900 mb-1 flex items-center justify-start px-5 gap-4 rounded-md cursor-pointer"
                  onClick={() => clickOnId(data)}
                  key={props.id}
                >
                  <div className=" w-9 h-9 rounded-full">
                    {
                      data.userId.DP ? <img
                        src={`http://localhost:8747/${data.userId.DP}`}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                        preload="metadata"
                      /> : <img
                        src={Default}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                        preload="metadata"
                      />
                    }

                  </div>
                  <div className="w-[20vw] h-12 flex flex-col justify-center items-center text-white/80 relative">
                    <div className="w-full h-8 text-[15px] flex items-center justify-start font-bold">
                      {data.userId.username}
                    </div>
                    <div className="w-full h-auto text-[14px] text-wrap">
                      {data.content}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </ScrollArea>
        <div className="flex items-center justify-center gap-2">
          <Input
            className="bg-gray-900/80 text-white"
            value={comment}
            placeholder="Add a comment"
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="bg-white hover:bg-white"
            onClick={() => sendComment()}
          >
            <IoMdSend className="text-black" />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Comment;
