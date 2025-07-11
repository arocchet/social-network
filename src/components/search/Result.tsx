"use client";
import Link from "next/link";
import React, { useState } from "react";
import { PostDetails } from "../feed/post/postDetails";

// Types
export interface AccountItem {
  id: string;
  type: "accounts";
  username: string;
  displayName: string;
  image: string;
}

export interface TagItem {
  id: number;
  type: "tags";
  name: string;
  postCount: number;
}

export interface PostItem {
  id: string;
  type: "posts";
  content: string;
  createdAt: string;
  images?: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    image: string;
  };
  stats: {
    likes: number;
    comments: number;
  };
}

type SearchItem = AccountItem | TagItem | PostItem;

interface ResultsListProps {
  query: string;
  results?: SearchItem[];
}

const ResultsList: React.FC<ResultsListProps> = ({ query, results = [] }) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const isAccountItem = (item: SearchItem): item is AccountItem =>
    item.type === "accounts";

  const isTagItem = (item: SearchItem): item is TagItem =>
    item.type === "tags";

  const isPostItem = (item: SearchItem): item is PostItem =>
    item.type === "posts";

  if (results.length === 0 && query.trim()) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--textMinimal)]">
          Aucun résultat pour "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((item) => {
        if (isAccountItem(item)) {
          return (
            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[var(--bgLevel2)] rounded-lg transition-colors">
              <Link href={`/profile/${item.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      item.username[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[var(--textNeutral)]">
                      {item.username}
                    </p>
                    <p className="text-xs text-[var(--textMinimal)]">
                      {item.displayName}
                    </p>
                  </div>
                </div></Link>

            </div>
          );
        }

        if (isTagItem(item)) {
          return (
            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-[var(--bgLevel2)] rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--bgLevel2)] flex items-center justify-center">
                  <span className="text-lg text-[var(--textNeutral)]">#</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--textNeutral)]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--textMinimal)]">
                    {item.postCount} posts
                  </p>
                </div>
              </div>
            </div>
          );
        }

        if (isPostItem(item)) {
          return (
            <div key={item.id}>
              <div
                className="p-4 border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel2)] transition-colors cursor-pointer"
                onClick={() => setSelectedPostId(item.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
                    {item.user.image ? (
                      <img src={item.user.image} alt={item.user.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      item.user.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 max-w-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-sm text-[var(--textNeutral)]">
                        {item.user.username}
                      </p>
                      <span className="text-xs text-[var(--textMinimal)]">
                        {item.user.displayName}
                      </span>
                      <span className="text-xs text-[var(--textMinimal)]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm  text-[var(--textNeutral)] mb-3 leading-relaxed">
                      {item.content}
                    </p>
                    {item.images && (
                      <div className="mb-3">
                        {item.images.includes('.mp4') || item.images.includes('.webm') || item.images.includes('.mov') ? (
                          <video
                            src={item.images}
                            controls
                            className="max-w-full h-auto rounded-lg"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={item.images}
                            alt="Post image"
                            className="max-w-full h-auto rounded-lg"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-[var(--textMinimal)]">
                      <span>{item.stats.likes} likes</span>
                      <span>{item.stats.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedPostId === item.id && (
                <PostDetails
                  postId={item.id}
                  onClose={() => setSelectedPostId(null)}
                />
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ResultsList;
