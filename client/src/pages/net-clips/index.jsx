import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '@/assets/Header'
import Navbar from '@/assets/Navbar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { apiClient } from '@/lib/api-client'
import useAppStore from '@/store'
import { GET_RANDOM_NETCLIPS } from '@/utils/constant'
import NetClip from '@/assets/NetClip'
import NetClipHeader from '@/assets/NetClipHeader'
import NetClipFooter from '@/assets/NetClipFooter'
import { io } from 'socket.io-client'

const NetClips = () => {

    const { netClips, setNetClips } = useAppStore();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((param) => {
            // // console.log(param);
            if (param[0].isIntersecting) {
                observer.unobserve(lastNetClip)
                fetchData()
            }
        })

        const lastNetClip = document.querySelector(".NetClipsComponent:last-child")
        // // console.log(lastNetClip);
        if (!lastNetClip) return;
        observer.observe(lastNetClip)
    }, [netClips])

    const fetchData = async () => {
        try {
            const NetClips = await apiClient.get(GET_RANDOM_NETCLIPS, { withCredentials: true })
            // console.log({NetClips});
            setNetClips(NetClips.data.netClip)
        } catch (error) {
            console.log({ error });
        }
    }

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-start">
            <Header />
            <div className="flex flex-col-reverse md:flex-row justify-center items-center w-full h-[92vh] ">
                <Navbar />
                <div className="w-full h-[82vh] md:w-[82vw] md:h-[92vh] flex justify-center items-start bg-black/95 relative dark:bg-gray-100/95" >
                    <div className=" w-[100vw] md:w-[60vw] lg:w-[30vw] h-full bg-black dark:bg-white flex items-center justify-center overflow-hidden relative">
                            <NetClipHeader />
                        <div className="snap-y snap-mandatory h-full w-full overflow-y-scroll scrollbar-hide flex flex-col">
                            {netClips.map((netClip) => (
                                <div className="relative NetClipsComponent snap-center h-full w-full flex justify-center items-center bg-transparent ">
                                    <NetClip contentUrl={netClip.videos[0].contentUrl}  />
                                    <NetClipFooter userData={netClip.user} video={netClip.videos[0]}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NetClips