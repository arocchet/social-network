import React from 'react'
import { IoMdHeartEmpty } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
const PostReaction = () => {
    return (
        <div className='gap-2 flex items-center'>
            <div className='gap-2 flex items-center'>
                <IoMdHeartEmpty size={30} className='hover:text-[var(--redFillAlt)] transition-colors' />
                <div className='font-semibold'>200</div>
            </div>
            <div className='gap-2 flex items-center'>
                <IoChatbubbleOutline size={25} className='hover:text-[var(--detailNeutral)] transition-colors' />
                <div className='font-semibold'>20</div>
            </div>
            <div className='gap-2 flex items-center'>
                <LuSend size={23} className='hover:text-[var(--detailNeutral)] transition-colors' />
                <div className='font-semibold'>10</div>
            </div>
        </div>
    )
}

export default PostReaction