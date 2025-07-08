import LikeComponent from "@/components/reaction/toggleLike";
import React from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuSend } from "react-icons/lu";

interface PostContent {
  postId: string;
  isLiked?: boolean;
  likesCount?: number;
}

const PostReaction = ({ postId, isLiked, likesCount }: PostContent) => {
  return (
    <div className="gap-2 -mt-2 flex items-center">
      <div className="gap-2 flex items-center">
        <LikeComponent
          contentType={"post"}
          content={{
            postId: postId,
            isLiked: isLiked || false,
            likesCount: likesCount || 0,
          }}
        />
        <div className="font-semibold">{likesCount || 0}</div>{" "}
        {/* ✅ Valeur dynamique */}
      </div>

      <div className="gap-2 flex items-center">
        <IoChatbubbleOutline
          size={25}
          className="hover:text-[var(--detailNeutral)] transition-colors"
        />
        <div className="font-semibold">20</div>
      </div>

      <div className="gap-2 flex items-center">
        <LuSend
          size={23}
          className="hover:text-[var(--detailNeutral)] transition-colors"
        />
        <div className="font-semibold">10</div>
      </div>
    </div>
  );
};

export default PostReaction;
