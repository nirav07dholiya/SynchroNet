import React, { useEffect, useRef, useState } from "react";
import Header from "@/assets/Header";
import Navbar from "@/assets/Navbar";
import { FaSearch } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiClient } from "@/lib/api-client";
import { SEARCH_INPUT_ROUTE } from "@/utils/constant";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Default from "../../assets/images/default-user.png";
import Lottie from "react-lottie";
import LottieAnim from "../../assets/lottie.json";
import { useNavigate } from "react-router-dom";
import useAppStore from "@/store";

const Search = () => {

    const navigate = useNavigate()
    const [searchedTerm, setSearchedTerm] = useState("");
    const {setOpenIdData}=useAppStore();
    const searchInputRef = useRef();

    useEffect(()=>{searchInputRef.current.focus();},[])

    const searchData = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_INPUT_ROUTE,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status == 200 && response.data.users)
                    setSearchedTerm(response.data.users);
            } else setSearchedTerm("");
        } catch (error) {
            // console.log({ error });
        }
    };

    const clickOnId = (data) => {
        // console.log(data);
        setOpenIdData(data);
        navigate('/open-id');
    }

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start ">
            <Header />
            <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
                <Navbar />
                <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 dark:bg-gray-100/95">
                    <div className=" w-[100vw] md:w-[60vw] lg:w-[35vw] h-full bg-black dark:bg-white flex flex-col items-center overflow-hidden ">
                        <div className="h-[12vh] w-[88%] flex items-center justify-center ">
                            <div className="bg-white w-full h-12 rounded-lg">
                                <div className="flex items-center w-full px-5 h-full bg-black/90 dark:bg-gray-100/90 ">
                                    <FaSearch className="text-gray-500 w-auto h-auto text-xl" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="border-none outline-none w-full bg-transparent focus:outline-none h-10 px-4 rounded-lg text-white/60 dark:text-black/60"
                                        onChange={(e) => searchData(e.target.value)}
                                        ref={searchInputRef}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[80vh] flex justify-center items-center">
                            {searchedTerm == "" ? (
                                <div className="w-full">
                                    <Lottie
                                        isClickToPauseDisabled={true}
                                        height={200}
                                        width={200}
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: LottieAnim,
                                        }}
                                    />
                                </div>
                            ) : (
                                <ScrollArea className="w-full h-full px-9 flex flex-col items-center justify-center gap-1">
                                    {searchedTerm.map((data) => {
                                        let image;
                                        if (data.DP) image = `http://localhost:8747/${data.DP}`;
                                        else image = Default;
                                        return (
                                            <div className="w-full h-16 bg-white rounded-lg dark:bg-black">
                                                <div className="w-full h-full bg-black/90 dark:bg-gray-100/90 my-3 flex items-center justify-start gap-4 cursor-pointer text-white/70 dark:text-black/70 hover:bg-black/80 px-4" onClick={()=>clickOnId(data)}>
                                                    <div className="w-[13%] h-full flex items-center justify-center">
                                                        <Avatar className="md:w-11 md:h-11 w-8 h-8">
                                                            <AvatarImage
                                                                src={image}
                                                                alt="profile"
                                                                className="object-cover w-full h-full bg-black"
                                                            />
                                                        </Avatar>
                                                    </div>
                                                    <div className="w-[60%] h-full">
                                                        <div className="w-full h-[57%] font-bold text-lg flex items-end justify-start">
                                                            {data.username.toLowerCase()}
                                                        </div>
                                                        <div className="w-full h-[40%] text-[12px]  flex items-start justify-start font-semibold">
                                                            {data.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
