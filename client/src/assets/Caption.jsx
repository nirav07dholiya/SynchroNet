import React from 'react'

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Caption = (props) => {
    return (
        <HoverCard>
            <HoverCardTrigger
                asChild
                className="absolute top-0 right-0 z-20"
            >
                <Button
                    variant="link"
                    className="text-[10px] bg-white/30 p-3 font-bold dark:bg-black/40"
                >
                    <IoMdInformationCircleOutline className="" />
                    {/* Caption */}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
                <div className="flex justify-between space-x-4">
                    {props.caption}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default Caption