/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import PostCard from "@/components/feed/post/postCard"

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col bg-[var(--bgLevel1)]">
      <main className="flex grow flex-col overflow-auto">
        <div className="w-full md:hidden bg-[var(--bgLevel1)] border-b-1 border-[var(--detailMinimal)] fixed top-0 z-50 flex justify-center items-center py-4">
          <img
            src={"/konekt-logo-full.png"}
            className="w-32 h-auto block md:hidden"
          />
        </div>

        <ul className="max-w-2xl w-full mx-auto space-y-4 p-4">
          <PostCard />
        </ul>
      </main>
    </div>
  )
}
