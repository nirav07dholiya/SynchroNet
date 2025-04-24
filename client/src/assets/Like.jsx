import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import useAppStore from "@/store";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO_BY_POSTID } from "@/utils/constant";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Like = (props) => {
  const { setOpenIdData, openIdData, userInfo } = useAppStore();
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    // console.log(props.id);
    setUserId(userInfo._id)
    const fetch = async () => {
      const response = await apiClient.post(GET_USER_INFO_BY_POSTID, { postId: props.id }, { withCredentials: true })
      // console.log({ response });
      if (response.status == 200 && response.data) {
        setUserData(response.data.response)
        // console.log({ userData });
      }
    }
    fetch()
  }, [props.id])


  const clickOnId = (data) => {
    // console.log({ data });
    setOpenIdData(data);
    navigate('/open-id');
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        className={`w-auto h-auto px-1 bg-transparent hover:bg-transparent hover:text-white border-none ${props.call == "NetClipFooter" && "absolute top-8 "}`}
      >
        {props.likeLength > 0 && <Button variant="outline">{props.likeLength}</Button>}
      </HoverCardTrigger>
      <HoverCardContent className="w-[250px] md:w-[300px] h-60 bg-black/95 p-2">
        <ScrollArea className="w-full h-full flex flex-col items-center justify-center" >
          {
            userData.map((data) => {
              return (
                <>
                  <div className={`w-full h-12 bg-gray-900 mb-1 flex items-center justify-star t px-5 gap-4 rounded-md ${ data._id === userId ? " cursor-none" : "cursor-pointer"}`}
                    onClick={() => clickOnId(data)}
                    key={props.id}>
                    <div className=" w-9 h-9 rounded-full">
                      <img
                        src={`http://localhost:8747/${data.DP}`}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="w-[20vw] h-12 flex flex-col justify-center items-center text-white/80">
                      <div className="w-full text-[15px]">{data.username}</div>
                      <div className="w-full text-[9px]">{data.name}</div>
                    </div>

                  </div>
                </>
              )

            })
          }
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Like;
