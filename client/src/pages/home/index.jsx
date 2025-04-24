import Header from '@/assets/Header'
import Navbar from '@/assets/Navbar'
import useAppStore from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient } from '@/lib/api-client'
import { GET_RANDOM_POST } from '@/utils/constant'
import InfiniteScroll from "react-infinite-scroll-component";
import HomePosts from '@/assets/HomePosts'

const Home = () => {

    const { userInfo } = useAppStore();
    const [homeData, setHomeData] = useState([])
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        if (!userInfo.profileSetUp) {
            toast.error("Please setup profile to continue.")
            navigate('/profile')
        }
        
    }, [userInfo, navigate])

    useEffect(() => {
        getFetchCardData()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((param)=>{
            // console.log(param);
            if(param[0].isIntersecting){
                observer.unobserve(lastPost)
                getFetchCardData()
            }
        })

        const lastPost = document.querySelector(".postComponent:last-child")
        // console.log(lastPost);
        if(!lastPost) return;
        observer.observe(lastPost)
    }, [homeData])

    const getFetchCardData = async () => {
        try {
            // console.log("fetchData");
            const response = await apiClient.get(GET_RANDOM_POST, { withCredentials: true });
            setHomeData((prevData) => [...prevData, ...response.data])
            // console.log(response.data.length  );
        } catch (error) {
            console.log({ error });
        }
    }


    return (
        <>
            <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start">
                <Header />
                <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
                    <Navbar />
                    <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 relative dark:bg-gray-100/95" >
                        <div className=" w-[100vw] md:w-[60vw] lg:w-[35vw] h-full bg-black overflow-y-auto dark:bg-white">
                            <ScrollArea className="h-full w-full rounded-md border p-1 text-white outline-none border-none flex flex-col items-center justify-center dark:text-black gap-5 overflow-y-scroll scrollbar-hide" ref={containerRef} id="scrollDiv" onScroll={getFetchCardData}>
                                {
                                    homeData.map((onePost,index) => {
                                        return (
                                            <div className="postComponent" key={index}>
                                            <HomePosts onePost={onePost} />
                                            </div>
                                            )
                                    })
                                }
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home