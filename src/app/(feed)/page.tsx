/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import PostCard from "@/components/feed/post/postCard"
import { Button } from "@/components/ui/button"
import { MessageCircle, Play, PlusSquare, Search, Send, Home, Settings2, SettingsIcon } from "lucide-react"
import Image from "next/image"
import { ModeToggle } from "@/components/toggle-theme"
import Settings from "@/components/settings/SettingsMain"
import { Stories } from "@/components/stories/stories"
import NavigationBar from "@/components/feed/navBar/navigationBar"


export default function HomePage() {
  return (
    <div className="flex flex-col bg-[var(--bgLevel1)] h-full w-full">

      <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] bg-[var(--bgLevel1)] sticky top-0 z-50">
        {/* <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-400 bg-clip-text text-transparent">
          Instagram
        </div> */}

        <Image
          src="/konekt-logo-full.png"
          alt="Konekt Logo"
          width={128}
          height={128}
        >


        </Image>
        <div className="flex items-center gap-2">
          <ModeToggle/>
          <Button variant="ghost" size="icon">
            <MessageCircle className="w-6 h-6" />
          </Button>
          {/* <Button variant="ghost" size="icon">
            <Send className="w-6 h-6" />
          </Button> */}
        </div>
      </header>

      <div className="border-b border-[var(--detailMinimal)] bg-[var(--bgLevel2)]">
        <Stories />
      </div>

      <div className="bg-[var(--bgLevel1)] mx-auto max-w-xl px-2 py-2">
        <PostCard />
      </div>
        
      <NavigationBar/>

    </div>
  )
}
